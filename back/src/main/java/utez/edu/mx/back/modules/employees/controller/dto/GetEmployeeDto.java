package utez.edu.mx.back.modules.employees.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GetEmployeeDto {
    @NotNull(message = "El ID del empleado es obligatorio")
    private Long id;
}
