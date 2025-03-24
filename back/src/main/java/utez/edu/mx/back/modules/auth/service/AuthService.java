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
import utez.edu.mx.back.kernel.TypesResponse;
import utez.edu.mx.back.modules.auth.controller.dto.SignInDTO;
import utez.edu.mx.back.modules.employees.model.Employee;
import utez.edu.mx.back.modules.employees.model.IEmployeeRepository;
import utez.edu.mx.back.security.jwt.JwtProvider;
import utez.edu.mx.back.security.service.UserDetailsServiceImpl;

import java.util.Objects;

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

    @Transactional(readOnly = true)
    public ResponseEntity<Object> signIn(SignInDTO dto){
        try {
            Employee employee = employeeRepository.findByEmail(dto.getEmail()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(auth);

            UserDetails userDetails = userDetailsService.loadUserByUsername(dto.getEmail());
            String token = jwtProvider.generateToken(userDetails, employee);

            return new ResponseEntity<>(new ApiResponse<>(token, TypesResponse.SUCCESS, "Inicio de sesión exitoso"), HttpStatus.OK);
        } catch (AuthenticationException e) {
            logger.error("Error de Autenticación: {}", e.getMessage());
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "Verifique sus credenciales"), HttpStatus.BAD_REQUEST);
        }
    }
}
