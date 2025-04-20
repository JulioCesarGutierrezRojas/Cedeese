package utez.edu.mx.back.modules.projects.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import utez.edu.mx.back.modules.roles.model.TypeRol;

@Data
public class GetProjectsByRoleDto {
    @NotNull(message = "El ID del empleado es obligatorio")
    private Long employeeId;
    
    @NotNull(message = "El rol es obligatorio")
    private TypeRol role;
}