package utez.edu.mx.back.modules.projects.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CompleteProjectDto {
    @NotNull(message = "El ID del proyecto es obligatorio")
    private Long id;
}