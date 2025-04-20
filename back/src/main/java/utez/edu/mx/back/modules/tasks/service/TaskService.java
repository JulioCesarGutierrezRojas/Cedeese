package utez.edu.mx.back.modules.tasks.service;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.kernel.TypesResponse;
import utez.edu.mx.back.modules.phases.model.IPhasesRepository;
import utez.edu.mx.back.modules.phases.model.Phase;
import utez.edu.mx.back.modules.projects.model.IProjectRepository;
import utez.edu.mx.back.modules.projects.model.Project;
import utez.edu.mx.back.modules.projects.model.ProjectPhase;
import utez.edu.mx.back.modules.tasks.controller.dto.*;
import utez.edu.mx.back.modules.tasks.model.ITaskRepository;
import utez.edu.mx.back.modules.tasks.model.Task;

import java.sql.SQLException;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final ITaskRepository taskRepository;
    private final IProjectRepository projectRepository;
    private final IPhasesRepository phaseRepository;

    /**
     * Validates if a project exists by its ID
     * @param projectId The ID of the project to validate
     * @return ResponseEntity with error message if project doesn't exist, null otherwise
     */
    private ResponseEntity<Object> validateProjectExists(Long projectId) {
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El proyecto especificado no existe"),
                    HttpStatus.BAD_REQUEST
            );
        }
        return null;
    }

    /**
     * Validates if a phase exists by its ID
     * @param phaseId The ID of the phase to validate
     * @return ResponseEntity with error message if phase doesn't exist, null otherwise
     */
    private ResponseEntity<Object> validatePhaseExists(Long phaseId) {
        Optional<Phase> phase = phaseRepository.findById(phaseId);
        if (phase.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "La fase especificada no existe"),
                    HttpStatus.BAD_REQUEST
            );
        }
        return null;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();

        return new ResponseEntity<>(new ApiResponse<>(tasks, TypesResponse.SUCCESS, "Lista de tareas obtenida correctamente."), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getTaskById(GetTaskDto dto) {
        Task foundTask = taskRepository.findById(dto.getId()).orElse(null);

        if (Objects.isNull(foundTask)) {
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "Tarea no encontrada"), HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(new ApiResponse<>(foundTask, TypesResponse.SUCCESS, "Tarea encontrada correctamente."), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> createTask(CreateTaskDto dto) {
        // Validar que el proyecto exista
        ResponseEntity<Object> projectValidation = validateProjectExists(dto.getProjectId());
        if (projectValidation != null)
            return projectValidation;

        // Validar que la fase exista
        ResponseEntity<Object> phaseValidation = validatePhaseExists(dto.getPhaseId());
        if (phaseValidation != null)
            return phaseValidation;


        // Obtener el proyecto y la fase
        Project project = projectRepository.findById(dto.getProjectId()).get();
        Phase phase = phaseRepository.findById(dto.getPhaseId()).get();

        // Crear y configurar la nueva tarea
        Task task = new Task(dto.getName(), dto.getCompleted(), project, phase);

        // Guardar la tarea en la base de datos
        taskRepository.save(task);

        // Retornar la tarea creada directamente
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Tarea creada correctamente."),
                HttpStatus.CREATED
        );
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> updateTask(UpdateTaskDto dto) {
        // Validar que la tarea exista
        Task foundTask = taskRepository.findById(dto.getId()).orElse(null);

        if (Objects.isNull(foundTask))
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "La tarea no existe"),
                    HttpStatus.NOT_FOUND
            );

        // Validar que el proyecto exista
        ResponseEntity<Object> projectValidation = validateProjectExists(dto.getProjectId());

        if (projectValidation != null)
            return projectValidation;

        // Validar que la fase exista
        ResponseEntity<Object> phaseValidation = validatePhaseExists(dto.getPhaseId());

        if (phaseValidation != null)
            return phaseValidation;

        // Obtener el proyecto y la fase
        Project project = projectRepository.findById(dto.getProjectId()).get();
        Phase phase = phaseRepository.findById(dto.getPhaseId()).get();

        // Actualizar la tarea
        foundTask.setName(dto.getName());
        foundTask.setCompleted(dto.getCompleted());
        foundTask.setProject(project);
        foundTask.setPhase(phase);

        // Guardar los cambios
        taskRepository.save(foundTask);

        // Retornar la tarea actualizada directamente
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Tarea actualizada correctamente."),
                HttpStatus.OK
        );
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> deleteTask(DeleteTaskDto dto) {
        Optional<Task> optionalTask = taskRepository.findById(dto.getId());

        if (optionalTask.isEmpty())
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "Tarea no encontrada"),
                    HttpStatus.NOT_FOUND
            );


        taskRepository.deleteById(dto.getId());

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Tarea eliminada correctamente."),
                HttpStatus.OK
        );
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> changeTaskStatus(ChangeTaskStatusDto dto) {
        Task foundTask = taskRepository.findById(dto.getId()).orElse(null);

        if (Objects.isNull(foundTask))
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "Tarea no encontrada"),
                    HttpStatus.NOT_FOUND
            );

        foundTask.setCompleted(!foundTask.getCompleted());
        taskRepository.save(foundTask);

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Estado de la tarea actualizado correctamente."),
                HttpStatus.OK
        );
    }

    /**
     * Marks a task as completed
     * @param dto The DTO containing the task ID
     * @return ResponseEntity with success message or error message
     */
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> markTaskAsCompleted(ChangeTaskStatusDto dto) {
        Task foundTask = taskRepository.findById(dto.getId()).orElse(null);

        if (Objects.isNull(foundTask))
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "Tarea no encontrada"),
                    HttpStatus.NOT_FOUND
            );

        foundTask.setCompleted(true);
        taskRepository.save(foundTask);

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Tarea marcada como completada correctamente."),
                HttpStatus.OK
        );
    }

    /**
     * Gets all tasks for a project, optionally filtered by phase
     * @param dto The DTO containing the project ID and optionally the phase ID
     * @return ResponseEntity with the list of tasks or an error message
     */
    @Transactional(readOnly = true)
    public ResponseEntity<Object> getTasksByProjectAndCurrentPhase(GetTasksByProjectDto dto) {
        // Validar que el proyecto exista
        ResponseEntity<Object> projectValidation = validateProjectExists(dto.getProjectId());
        if (projectValidation != null)
            return projectValidation;

        List<Task> tasks;

        // Si se proporciona un ID de fase, validar que exista y obtener tareas para esa fase
        if (dto.getPhaseId() != null) {
            // Validar que la fase exista
            ResponseEntity<Object> phaseValidation = validatePhaseExists(dto.getPhaseId());
            if (phaseValidation != null)
                return phaseValidation;

            // Obtener tareas para el proyecto y la fase especificada
            tasks = taskRepository.findByProjectIdAndPhaseId(dto.getProjectId(), dto.getPhaseId());

            return new ResponseEntity<>(
                    new ApiResponse<>(tasks, TypesResponse.SUCCESS, "Lista de tareas del proyecto en la fase especificada obtenida correctamente."),
                    HttpStatus.OK
            );
        } else {
            // Si no se proporciona un ID de fase, obtener todas las tareas del proyecto
            tasks = taskRepository.findByProjectId(dto.getProjectId());

            return new ResponseEntity<>(
                    new ApiResponse<>(tasks, TypesResponse.SUCCESS, "Lista de tareas del proyecto obtenida correctamente."),
                    HttpStatus.OK
            );
        }
    }

}
