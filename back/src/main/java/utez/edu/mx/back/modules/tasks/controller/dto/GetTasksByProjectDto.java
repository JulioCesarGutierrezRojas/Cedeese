package utez.edu.mx.back.modules.tasks.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GetTasksByProjectDto {
    @NotNull(message = "El ID del proyecto es obligatorio")
    private Long projectId;

    private Long phaseId; // Optional: if provided, will get tasks for this specific phase
}
