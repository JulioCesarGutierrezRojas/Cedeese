package utez.edu.mx.back.modules.tasks.service;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.kernel.TypesResponse;
import utez.edu.mx.back.modules.phases.model.IPhasesRepository;
import utez.edu.mx.back.modules.projects.model.IProjectRepository;
import utez.edu.mx.back.modules.tasks.controller.dto.CreateTaskDto;
import utez.edu.mx.back.modules.tasks.controller.dto.DeleteTaskDto;
import utez.edu.mx.back.modules.tasks.controller.dto.GetTaskDto;
import utez.edu.mx.back.modules.tasks.controller.dto.UpdateTaskDto;
import utez.edu.mx.back.modules.tasks.model.ITaskRepository;
import utez.edu.mx.back.modules.tasks.model.Task;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final ITaskRepository taskRepository;
    private final IProjectRepository projectRepository;
    private final IPhasesRepository phaseRepository;

    public ResponseEntity<Object> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();

        List<GetTaskDto> dtoList = tasks.stream().map(task -> {
            GetTaskDto dto = new GetTaskDto();
            dto.setId(task.getId());
            dto.setName(task.getName());
            dto.setCompleted(task.getCompleted());
            dto.setProjectId(task.getProject().getId());
            dto.setPhaseId(task.getPhase().getId());
            return dto;
        }).collect(Collectors.toList());

        return new ResponseEntity<>(
                new ApiResponse<>(dtoList, TypesResponse.SUCCESS, "Lista de tareas obtenida correctamente."),
                HttpStatus.OK
        );
    }

    public ResponseEntity<Object> getTaskById(Long id) {
        Optional<Task> optionalTask = taskRepository.findById(id);

        if (optionalTask.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "Tarea no encontrada"),
                    HttpStatus.NOT_FOUND
            );
        }

        Task task = optionalTask.get();
        GetTaskDto dto = new GetTaskDto();
        dto.setId(task.getId());
        dto.setName(task.getName());
        dto.setCompleted(task.getCompleted());
        dto.setProjectId(task.getProject().getId());
        dto.setPhaseId(task.getPhase().getId());

        return new ResponseEntity<>(
                new ApiResponse<>(dto, TypesResponse.SUCCESS, "Tarea encontrada correctamente."),
                HttpStatus.OK
        );
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> createTask(CreateTaskDto dto) {
        var project = projectRepository.findById(dto.getProjectId());
        var phase = phaseRepository.findById(dto.getPhaseId());

        if (project.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El proyecto especificado no existe"),
                    HttpStatus.BAD_REQUEST
            );
        }

        if (phase.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "La fase especificada no existe"),
                    HttpStatus.BAD_REQUEST
            );
        }

        Task task = new Task();
        task.setName(dto.getName());
        task.setCompleted(dto.getCompleted());
        task.setProject(project.get());
        task.setPhase(phase.get());

        Task saved = taskRepository.save(task);

        GetTaskDto responseDto = new GetTaskDto();
        responseDto.setId(saved.getId());
        responseDto.setName(saved.getName());
        responseDto.setCompleted(saved.getCompleted());
        responseDto.setProjectId(saved.getProject().getId());
        responseDto.setPhaseId(saved.getPhase().getId());

        return new ResponseEntity<>(
                new ApiResponse<>(responseDto, TypesResponse.SUCCESS, "Tarea creada correctamente."),
                HttpStatus.CREATED
        );
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> updateTask(UpdateTaskDto dto) {
        Optional<Task> optionalTask = taskRepository.findById(dto.getId());

        if (optionalTask.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "La tarea no existe"),
                    HttpStatus.NOT_FOUND
            );
        }

        var project = projectRepository.findById(dto.getProjectId());
        var phase = phaseRepository.findById(dto.getPhaseId());

        if (project.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El proyecto especificado no existe"),
                    HttpStatus.BAD_REQUEST
            );
        }

        if (phase.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "La fase especificada no existe"),
                    HttpStatus.BAD_REQUEST
            );
        }

        Task task = optionalTask.get();
        task.setName(dto.getName());
        task.setCompleted(dto.getCompleted());
        task.setProject(project.get());
        task.setPhase(phase.get());

        Task updated = taskRepository.save(task);

        GetTaskDto responseDto = new GetTaskDto();
        responseDto.setId(updated.getId());
        responseDto.setName(updated.getName());
        responseDto.setCompleted(updated.getCompleted());
        responseDto.setProjectId(updated.getProject().getId());
        responseDto.setPhaseId(updated.getPhase().getId());

        return new ResponseEntity<>(
                new ApiResponse<>(responseDto, TypesResponse.SUCCESS, "Tarea actualizada correctamente."),
                HttpStatus.OK
        );
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> deleteTask(DeleteTaskDto dto) {
        Optional<Task> optionalTask = taskRepository.findById(dto.getId());

        if (optionalTask.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "Tarea no encontrada"),
                    HttpStatus.NOT_FOUND
            );
        }

        taskRepository.deleteById(dto.getId());

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Tarea eliminada correctamente."),
                HttpStatus.OK
        );
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> changeTaskStatus(Long id, Boolean newStatus) {
        Optional<Task> optionalTask = taskRepository.findById(id);

        if (optionalTask.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "Tarea no encontrada"),
                    HttpStatus.NOT_FOUND
            );
        }

        Task task = optionalTask.get();
        task.setCompleted(newStatus); // usar el valor que viene del cliente
        taskRepository.save(task);

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Estado de la tarea actualizado correctamente."),
                HttpStatus.OK
        );
    }

}
