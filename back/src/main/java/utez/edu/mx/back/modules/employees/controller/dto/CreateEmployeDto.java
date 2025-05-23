package utez.edu.mx.back.modules.employees.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateEmployeDto {

    @NotNull(message = "El nombre de usuario es obligatorio")
    private String username;

    @NotNull(message = "La contraseña es obligatoria")
    private String password;

    @NotNull(message = "El nombre es obligatorio")
    private String name;

    @NotNull(message = "El apellido es obligatorio")
    private String lastname;

    @NotNull(message = "El correo electrónico es obligatorio")
    private String email;

    @NotNull(message = "El ID del rol es obligatorio")
    private Long rolId;
}
