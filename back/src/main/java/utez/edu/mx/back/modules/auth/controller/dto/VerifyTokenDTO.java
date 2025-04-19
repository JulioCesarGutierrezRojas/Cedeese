package utez.edu.mx.back.modules.auth.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VerifyTokenDTO {
    @NotNull(message = "El token es requerido")
    private String token;
}