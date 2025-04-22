package utez.edu.mx.back.modules.projects.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
import utez.edu.mx.back.modules.projects.controller.dto.ProjectLimitedViewDto;
import utez.edu.mx.back.modules.projects.controller.dto.ProjectLimitedViewResponseDto;
import utez.edu.mx.back.modules.projects.model.Project;
import utez.edu.mx.back.modules.projects.service.ProjectService;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Proyectos", description = "Endpoints de API para la gestión de proyectos")
public class ProjectController {
    private final ProjectService service;

    @Operation(summary = "Crear proyecto", description = "Crea un nuevo proyecto en el sistema")
    @PostMapping("/")
    public ResponseEntity<Object> saveProject(@RequestBody @Validated CreateProjectDto dto) {
        return service.saveProject(dto);
    }

    @Operation(summary = "Completar proyecto", description = "Marca un proyecto como completado")
    @PutMapping("/complete")
    public ResponseEntity<Object> completeProject(@RequestBody @Validated CompleteProjectDto dto) {
        return service.completeProject(dto);
    }

    @Operation(summary = "Asignar empleados", description = "Asigna empleados a un proyecto específico")
    @PostMapping("/assign-employees")
    public ResponseEntity<Object> assignEmployeesToProject(@RequestBody @Validated AssignEmployeesDto dto) {
        return service.assignEmployeesToProject(dto);
    }

    @Operation(summary = "Obtener todos los proyectos", description = "Recupera todos los proyectos según el rol del usuario")
    @PostMapping("/get-all")
    public ResponseEntity<Object> getAllProjects(@RequestBody @Validated GetProjectsByRoleDto dto) {
        return service.getAllProjects(dto);
    }

    @Operation(summary = "Obtener proyectos por empleado", description = "Recupera todos los proyectos asignados a un empleado específico")
    @PostMapping("/get-by-employee")
    public ResponseEntity<Object> getProjectByEmployee(@RequestBody @Validated GetProjectByEmployeeDto dto) {
        return service.getProjectByEmployee(dto);
    }

    @Operation(summary = "Obtener vista limitada del proyecto para AP", description = "Recupera solo el nombre y estado del proyecto para usuarios con rol AP")
    @PostMapping("/get-limited-view")
    public ResponseEntity<Object> getProjectLimitedView(@RequestBody @Validated ProjectLimitedViewDto dto) {
        return service.getProjectLimitedView(dto);
    }
}
