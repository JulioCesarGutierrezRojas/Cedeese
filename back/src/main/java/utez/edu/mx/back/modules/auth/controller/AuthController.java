package utez.edu.mx.back.modules.auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.back.modules.auth.controller.dto.ChangePasswordDTO;
import utez.edu.mx.back.modules.auth.controller.dto.SendEmailDTO;
import utez.edu.mx.back.modules.auth.controller.dto.SignInDTO;
import utez.edu.mx.back.modules.auth.controller.dto.VerifyTokenDTO;
import utez.edu.mx.back.modules.auth.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"*"})
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Endpoints de API para autenticación de usuarios y gestión de contraseñas")
public class AuthController {
    private final AuthService service;

    @Operation(summary = "Inicio de sesión", description = "Autentica a un usuario y devuelve un token JWT")
    @PostMapping("/signin")
    public ResponseEntity<Object> signin(@Validated @RequestBody SignInDTO dto) {
        return service.signIn(dto);
    }

    @Operation(summary = "Recuperar contraseña", description = "Envía un correo electrónico de recuperación de contraseña al usuario")
    @PostMapping("/recover-password")
    public ResponseEntity<Object> recoverPassword(@Validated @RequestBody SendEmailDTO dto) {
        return service.sendEmailRecover(dto);
    }

    @Operation(summary = "Verificar token", description = "Verifica si un token de restablecimiento de contraseña es válido")
    @PostMapping("/verify-token")
    public ResponseEntity<Object> verifyToken(@Validated @RequestBody VerifyTokenDTO dto) {
        return service.verifyToken(dto);
    }

    @Operation(summary = "Cambiar contraseña", description = "Cambia la contraseña del usuario utilizando un token válido")
    @PostMapping("/change-password")
    public ResponseEntity<Object> changePassword(@Validated @RequestBody ChangePasswordDTO dto) {
        return service.changePassword(dto);
    }
}
