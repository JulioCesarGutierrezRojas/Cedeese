package utez.edu.mx.back.modules.projects.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.modules.projects.controller.dto.AssignEmployeesDto;
import utez.edu.mx.back.modules.projects.controller.dto.CreateProjectDto;
import utez.edu.mx.back.modules.projects.controller.dto.CompleteProjectDto;
import utez.edu.mx.back.modules.projects.controller.dto.GetProjectByEmployeeDto;
import utez.edu.mx.back.modules.projects.controller.dto.GetProjectsByRoleDto;
import utez.edu.mx.back.modules.projects.model.Project;
import utez.edu.mx.back.modules.projects.service.ProjectService;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService service;

    @PostMapping("/")
    public ResponseEntity<Object> saveProject(@RequestBody @Validated CreateProjectDto dto) {
        return service.saveProject(dto);
    }

    @PutMapping("/complete")
    public ResponseEntity<Object> completeProject(@RequestBody @Validated CompleteProjectDto dto) {
        return service.completeProject(dto);
    }

    @PostMapping("/assign-employees")
    public ResponseEntity<Object> assignEmployeesToProject(@RequestBody @Validated AssignEmployeesDto dto) {
        return service.assignEmployeesToProject(dto);
    }

    @PostMapping("/get-all")
    public ResponseEntity<Object> getAllProjects(@RequestBody @Validated GetProjectsByRoleDto dto) {
        return service.getAllProjects(dto);
    }

    @PostMapping("/get-by-employee")
    public ResponseEntity<Object> getProjectByEmployee(@RequestBody @Validated GetProjectByEmployeeDto dto) {
        return service.getProjectByEmployee(dto);
    }
}
