package utez.edu.mx.back.modules.employees.dto;

import lombok.Data;
import utez.edu.mx.back.modules.projects.dto.ProjectsDto;
import utez.edu.mx.back.modules.roles.model.TypeRol;

import java.util.List;

@Data
public class EmployeesDto {
    private Long id;
    private String username;
    private String password;
    private String name;
    private String lastname;
    private String email;
    private Boolean status;
    private TypeRol rol;
    private String rolName;
    private List<ProjectsDto> projects;

    public EmployeesDto(Long id, String username, String name, String lastname,
                        String email, Boolean status, TypeRol rol) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.status = status;
        this.rol = rol;
        this.rolName = rol != null ? rol.name() : null;
        this.password = null;
        this.projects = null;
    }
}
