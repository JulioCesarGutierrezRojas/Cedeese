package utez.edu.mx.back.modules.tasks.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangeTaskStatusDto {
    @NotNull(message = "El ID de la tarea es obligatorio")
    private Long id;
    
}
