package utez.edu.mx.back.modules.projects.service;

import org.springframework.stereotype.Service;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.kernel.TypesResponse;
import utez.edu.mx.back.modules.projects.model.IProjectRepository;
import utez.edu.mx.back.modules.projects.model.Project;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    private final IProjectRepository IProjectRepository;

    public ProjectService(IProjectRepository IProjectRepository) {
        this.IProjectRepository = IProjectRepository;
    }

    //Traer todos los proyectos
    public List<Project> getAllProjects() {
        return IProjectRepository.findAll();
    }

    // Traer proyecto por id
    public ApiResponse<Project> getProjectById(Long id) {
        Optional<Project> project = IProjectRepository.findById(id);
        return project.map(value -> new ApiResponse<>(value, TypesResponse.SUCCESS, "Proyecto encontrado"))
                .orElseGet(() -> new ApiResponse<>(TypesResponse.ERROR, "Proyecto no encontrado"));
    }

    // Crear un proyecto
    public ApiResponse<Project> createProject(Project project) {
        try {
            Project savedProject = IProjectRepository.save(project);
            return new ApiResponse<>(savedProject, TypesResponse.SUCCESS, "Proyecto creado con éxito");
        } catch (Exception e) {
            return new ApiResponse<>(TypesResponse.ERROR, "Error al crear el proyecto: " + e.getMessage());
        }
    }

    //Actualizar proyecto
    public ApiResponse<Project> updateProject(Long id, Project updatedProject) {
        Optional<Project> existingProject = IProjectRepository.findById(id);
        if (existingProject.isPresent()) {
            Project project = existingProject.get();
            project.setName(updatedProject.getName());
            project.setIdentifier(updatedProject.getIdentifier());
            project.setStartDate(updatedProject.getStartDate());
            project.setEndDate(updatedProject.getEndDate());
            project.setStatus(updatedProject.getStatus());

            IProjectRepository.save(project);
            return new ApiResponse<>(project, TypesResponse.SUCCESS, "Proyecto actualizado con éxito");
        }
        return new ApiResponse<>(TypesResponse.ERROR, "Proyecto no encontrado");
    }

    //Eliminar proyecto
    public ApiResponse<Project> deleteProject(Long id) {
        if (IProjectRepository.existsById(id)) {
            IProjectRepository.deleteById(id);
            return new ApiResponse<>(TypesResponse.SUCCESS, "Proyecto eliminado con éxito");
        }
        return new ApiResponse<>(TypesResponse.ERROR, "Proyecto no encontrado");
    }

}
