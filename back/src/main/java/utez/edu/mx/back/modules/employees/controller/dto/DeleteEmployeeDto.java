package utez.edu.mx.back.modules.employees.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DeleteEmployeeDto {
    @NotNull(message = "El ID del empleado es obligatorio para eliminar")
    private Long id;
}
