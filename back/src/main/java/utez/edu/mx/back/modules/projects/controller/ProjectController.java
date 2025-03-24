package utez.edu.mx.back.modules.projects.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.modules.projects.model.Project;
import utez.edu.mx.back.modules.projects.service.ProjectService;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;


    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/")
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> getProjectById(@PathVariable Long id) {
        ApiResponse<Project> response = projectService.getProjectById(id);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/")
    public ResponseEntity<ApiResponse<Project>> createProject(@RequestBody Project project) {
        ApiResponse<Project> response = projectService.createProject(project);
        return ResponseEntity.ok(response);
    }


    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> updateProject(@PathVariable Long id, @RequestBody Project project) {
        ApiResponse<Project> response = projectService.updateProject(id, project);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> deleteProject(@PathVariable Long id) {
        ApiResponse<Project> response = projectService.deleteProject(id);
        return ResponseEntity.ok(response);
    }
}
