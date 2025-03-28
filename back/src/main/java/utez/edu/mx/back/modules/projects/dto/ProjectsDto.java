package utez.edu.mx.back.modules.projects.dto;

import lombok.Data;
import utez.edu.mx.back.modules.employees.dto.EmployeesDto;

import java.util.Date;
import java.util.List;

@Data
public class ProjectsDto {
    private Long id;
    private String name;
    private String identifier;
    private Date startDate;
    private Date endDate;
    private Boolean status;
    private List<EmployeesDto> employees;
    private List<ProjectPhaseDto> projectPhases;
}
