package utez.edu.mx.back.kernel;

import lombok.Data;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Data
public class PaginationDto {
    @NotNull(message = "El valor de paginación es obligatorio")
    private String value;

    @Valid
    @NotNull(message = "El tipo de paginación es obligatorio")
    private PaginationType paginationType;

    @Override
    public String toString() {
        return "PaginationDto{" +
                "value='" + value + '\'' +
                ", paginationType=" + paginationType.toString() +
                '}';
    }
}