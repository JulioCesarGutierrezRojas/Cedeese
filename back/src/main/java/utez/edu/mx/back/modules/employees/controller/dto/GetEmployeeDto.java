package utez.edu.mx.back.modules.employees.controller.dto;

import lombok.Data;

@Data
public class GetEmployeeDto {
    private Long id;
    private String username;
    private String name;
    private String lastname;
    private String email;
    private Boolean status;
    private String rolName;
}
