package utez.edu.mx.back.modules.auth.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordDTO {
    @NotNull(message = "El ID del usuario es requerido")
    private Long userId;

    @NotBlank(message = "El token es requerido")
    private String token;

    @NotBlank(message = "La contraseña es requerida")
    private String password;

    @NotBlank(message = "La confirmación de contraseña es requerida")
    private String confirmPassword;
}
