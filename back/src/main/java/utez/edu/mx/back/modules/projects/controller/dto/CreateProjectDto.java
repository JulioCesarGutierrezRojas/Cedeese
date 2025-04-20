package utez.edu.mx.back.modules.projects.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class CreateProjectDto {
    @NotNull(message = "El nombre del proyecto es obligatorio")
    private String name;

    @NotNull(message = "El identificador del proyecto es obligatorio")
    private String identifier;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private Date startDate;

    @NotNull(message = "La fecha de fin es obligatoria")
    private Date endDate;
}