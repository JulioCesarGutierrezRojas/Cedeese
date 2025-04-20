package utez.edu.mx.back.modules.tasks.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GetTaskDto {
    @NotNull(message = "El id de la tarea es requerido")
    private Long id;
}
