package utez.edu.mx.back.modules.tasks.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateTaskDto {

    @NotNull(message = "El nombre de la tarea es obligatorio")
    private String name;

    @NotNull(message = "El status es obligatorio")
    private Boolean completed;

    @NotNull(message = "El ID del proyecto es obligatorio")
    private Long projectId;

    @NotNull(message = "El ID de la fase es obligatorio")
    private Long phaseId;
    
    
}
