package utez.edu.mx.back.modules.projects.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GetProjectByEmployeeDto {
    @NotNull(message = "El ID del empleado es obligatorio")
    private Long employeeId;
}