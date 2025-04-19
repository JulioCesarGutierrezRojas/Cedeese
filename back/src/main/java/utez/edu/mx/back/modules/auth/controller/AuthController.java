package utez.edu.mx.back.modules.auth.controller;

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
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService service;

    @PostMapping("/signin")
    public ResponseEntity<Object> signin(@Validated @RequestBody SignInDTO dto) {
        return service.signIn(dto);
    }

    @PostMapping("/recover-password")
    public ResponseEntity<Object> recoverPassword(@Validated @RequestBody SendEmailDTO dto) {
        return service.sendEmailRecover(dto);
    }

    @PostMapping("/verify-token")
    public ResponseEntity<Object> verifyToken(@Validated @RequestBody VerifyTokenDTO dto) {
        return service.verifyToken(dto);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Object> changePassword(@Validated @RequestBody ChangePasswordDTO dto) {
        return service.changePassword(dto);
    }
}
