package utez.edu.mx.back.modules.auth.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.back.modules.auth.controller.dto.SignInDTO;
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
}
