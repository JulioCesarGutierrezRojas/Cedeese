package utez.edu.mx.back.modules.auth.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.kernel.MailSenderService;
import utez.edu.mx.back.kernel.TypesResponse;
import utez.edu.mx.back.modules.auth.controller.dto.ChangePasswordDTO;
import utez.edu.mx.back.modules.auth.controller.dto.SendEmailDTO;
import utez.edu.mx.back.modules.auth.controller.dto.SignInDTO;
import utez.edu.mx.back.modules.auth.controller.dto.VerifyTokenDTO;
import utez.edu.mx.back.modules.employees.model.Employee;
import utez.edu.mx.back.modules.employees.model.IEmployeeRepository;
import utez.edu.mx.back.security.jwt.JwtProvider;
import utez.edu.mx.back.security.service.UserDetailsServiceImpl;

import java.sql.SQLException;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private final IEmployeeRepository employeeRepository;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder encoder;
    private final MailSenderService mailSenderService;

    /**
     * Returns a Date object set to the current time plus the specified number of hours
     * @param hours Number of hours to add to the current time
     * @return Date object representing the expiration time
     */
    private Date getExpirationDate(int hours) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR_OF_DAY, hours);
        return calendar.getTime();
    }

    /**
     * Generates a 5-character token with uppercase letters and numbers
     * @return A 5-character string containing only uppercase letters and numbers
     */
    private String generateShortToken() {
        Random random = new Random();
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder token = new StringBuilder(5);

        for (int i = 0; i < 5; i++) {
            token.append(characters.charAt(random.nextInt(characters.length())));
        }

        return token.toString();
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> signIn(SignInDTO dto){
        try {
            Employee employee = employeeRepository.findByEmail(dto.getEmail()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(auth);

            UserDetails userDetails = userDetailsService.loadUserByUsername(dto.getEmail());
            String token = jwtProvider.generateToken(userDetails, employee);

            // Create a response map with token and role
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", employee.getRol().getRol().toString());

            return new ResponseEntity<>(new ApiResponse<>(response, TypesResponse.SUCCESS, "Inicio de sesión exitoso"), HttpStatus.OK);
        } catch (AuthenticationException e) {
            logger.error("Error de Autenticación: {}", e.getMessage());
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "Verifique sus credenciales"), HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> sendEmailRecover(SendEmailDTO dto){
        try {
            Employee employee = employeeRepository.findByEmail(dto.getEmail()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (employee == null)
                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "El usuario no existe"), HttpStatus.BAD_REQUEST);

            if (!employee.getStatus())
                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "El usuario esta deshabilitado"), HttpStatus.BAD_REQUEST);

            // Generate a unique token for password reset
            String resetToken = generateShortToken();

            // Calculate expiration date (1 hour from now)
            Date expirationDate = getExpirationDate(1);

            // Save this token in the database with an expiration time and associate it with the user's account
            employee.setResetToken(resetToken);
            employee.setResetTokenExpiration(expirationDate);
            employeeRepository.save(employee);

            // Prepare template variables
            Map<String, Object> templateVariables = new HashMap<>();
            templateVariables.put("userName", employee.getName());
            templateVariables.put("resetToken", resetToken);
            templateVariables.put("expirationTime", "1 hora");
            templateVariables.put("expirationDate", expirationDate);

            // Send the email
            boolean emailSent = mailSenderService.sendTemplateEmail(
                employee.getEmail(),
                "Recuperación de contraseña CDS",
                "recover-password-mail",
                templateVariables
            );

            if (!emailSent) {
                logger.error("Failed to send password recovery email to: {}", employee.getEmail());
                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.ERROR, "No se pudo enviar el correo de recuperación"), HttpStatus.INTERNAL_SERVER_ERROR);
            }

            logger.info("Password recovery email sent to: {}", employee.getEmail());
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.SUCCESS, "Se ha enviado un correo con instrucciones para recuperar tu contraseña"), HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error sending recovery email: ", e);
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.ERROR, "Error al procesar la solicitud: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Verifies if a token is valid and returns the user ID associated with it
     * @param dto DTO containing the token to verify
     * @return ResponseEntity with the user ID if the token is valid, or an error message if it's not
     */
    @Transactional(readOnly = true)
    public ResponseEntity<Object> verifyToken(VerifyTokenDTO dto) {
        try {
            // Find employee with the given token
            Employee employee = employeeRepository.findByResetToken(dto.getToken()).orElse(null);

            // Check if employee exists and token is valid
            if (employee == null) {
                logger.warn("Token not found: {}", dto.getToken());
                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "Token inválido"), HttpStatus.BAD_REQUEST);
            }

            // Check if token has expired
            Date now = new Date();
            if (employee.getResetTokenExpiration().before(now)) {
                logger.warn("Token expired for user: {}", employee.getId());
                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "El token ha expirado"), HttpStatus.BAD_REQUEST);
            }

            // Token is valid, return user ID and token
            Map<String, Object> response = new HashMap<>();
            response.put("userId", employee.getId());
            response.put("token", dto.getToken());

            logger.info("Token verified successfully for user: {}", employee.getId());
            return new ResponseEntity<>(new ApiResponse<>(response, TypesResponse.SUCCESS, "Token válido"), HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error verifying token: ", e);
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.ERROR, "Error al verificar el token: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Changes the password for a user
     * @param dto DTO containing the user ID, new password, and password confirmation
     * @return ResponseEntity with success message if password was changed, or an error message if it wasn't
     */
    @Transactional
    public ResponseEntity<Object> changePassword(ChangePasswordDTO dto) {
        try {
            // Find employee with the given ID
            Employee employee = employeeRepository.findById(dto.getUserId()).orElse(null);

            // Check if employee exists
            if (employee == null) {
                logger.warn("User not found with ID: {}", dto.getUserId());
                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "Usuario no encontrado"), HttpStatus.BAD_REQUEST);
            }

            // Check if token matches the employee's reset token
            if (employee.getResetToken() == null || !employee.getResetToken().equals(dto.getToken())) {
                logger.warn("Token doesn't match for user: {}", dto.getUserId());
                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "Token inválido para este usuario"), HttpStatus.BAD_REQUEST);
            }

            // Check if token has expired
            Date now = new Date();
            if (employee.getResetTokenExpiration() == null || employee.getResetTokenExpiration().before(now)) {
                logger.warn("Token expired for user: {}", employee.getId());
                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "El token ha expirado"), HttpStatus.BAD_REQUEST);
            }

            // Check if passwords match
            if (!dto.getPassword().equals(dto.getConfirmPassword())) {
                logger.warn("Passwords don't match for user: {}", dto.getUserId());
                return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "Las contraseñas no coinciden"), HttpStatus.BAD_REQUEST);
            }

            // Encode the new password
            String encodedPassword = encoder.encode(dto.getPassword());

            // Update the user's password
            employee.setPassword(encodedPassword);

            // Clear the reset token and expiration date
            employee.setResetToken(null);
            employee.setResetTokenExpiration(null);

            // Save the changes
            employeeRepository.save(employee);

            logger.info("Password changed successfully for user: {}", dto.getUserId());
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.SUCCESS, "Contraseña actualizada correctamente"), HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error changing password: ", e);
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.ERROR, "Error al cambiar la contraseña: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
