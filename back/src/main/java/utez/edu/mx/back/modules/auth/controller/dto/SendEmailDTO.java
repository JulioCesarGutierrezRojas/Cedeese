package utez.edu.mx.back.modules.auth.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendEmailDTO {
    @NotNull(message = "El email es requerido")
    private String email;
}
