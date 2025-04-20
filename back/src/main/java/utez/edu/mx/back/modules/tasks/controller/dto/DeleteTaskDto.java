package utez.edu.mx.back.modules.tasks.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DeleteTaskDto {
    @NotNull(message = "El ID de la tarea es obligatorio para eliminar")
    private Long id;
}
