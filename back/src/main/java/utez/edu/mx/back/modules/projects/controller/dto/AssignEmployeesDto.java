package utez.edu.mx.back.modules.projects.controller.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class AssignEmployeesDto {
    @NotNull(message = "El ID del proyecto es obligatorio")
    private Long projectId;

    @NotNull(message = "El ID del empleado RAPE es obligatorio")
    private Long rapeId;

    @NotNull(message = "El ID del empleado RD es obligatorio")
    private Long rdId;

    @NotNull(message = "Los IDs de los empleados AP son obligatorios")
    @Size(min = 4, max = 4, message = "Se requieren exactamente 4 empleados AP")
    private List<Long> apIds;
}