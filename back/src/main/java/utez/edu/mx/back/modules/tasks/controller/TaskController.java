package utez.edu.mx.back.modules.tasks.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.back.modules.tasks.controller.dto.*;
import utez.edu.mx.back.modules.tasks.service.TaskService;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Tareas", description = "Endpoints de API para la gestión de tareas")
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "Crear tarea", description = "Crea una nueva tarea en el sistema")
    @PostMapping("/")
    public ResponseEntity<Object> createTask(@RequestBody @Validated CreateTaskDto dto) {
        return taskService.createTask(dto);
    }

    @Operation(summary = "Actualizar tarea", description = "Actualiza la información de una tarea existente")
    @PutMapping("/")
    public ResponseEntity<Object> updateTask(@RequestBody @Validated UpdateTaskDto dto) {
        return taskService.updateTask(dto);
    }

    @Operation(summary = "Eliminar tarea", description = "Elimina una tarea del sistema")
    @DeleteMapping("/")
    public ResponseEntity<Object> deleteTask(@RequestBody @Validated DeleteTaskDto dto) {
        return taskService.deleteTask(dto);
    }

    @Operation(summary = "Obtener todas las tareas", description = "Recupera una lista de todas las tareas")
    @GetMapping("/")
    public ResponseEntity<Object> getAllTasks() {
        return taskService.getAllTasks();
    }

    @Operation(summary = "Obtener tarea por ID", description = "Recupera una tarea específica por su ID")
    @GetMapping("/one")
    public ResponseEntity<Object> getTaskById(@RequestBody @Validated GetTaskDto dto) {
         return taskService.getTaskById(dto);
    }

    @Operation(summary = "Cambiar estado de la tarea", description = "Actualiza el estado de una tarea (completada/no completada)")
    @PatchMapping("/change-status")
    public ResponseEntity<Object> changeTaskStatus(@RequestBody @Validated ChangeTaskStatusDto dto) {
        return taskService.changeTaskStatus(dto);
    }

    @Operation(summary = "Obtener tareas por proyecto", description = "Recupera todas las tareas de un proyecto en su fase actual")
    @PostMapping("/project-tasks")
    public ResponseEntity<Object> getTasksByProjectAndCurrentPhase(@RequestBody @Validated GetTasksByProjectDto dto) {
        return taskService.getTasksByProjectAndCurrentPhase(dto);
    }

    @Operation(summary = "Marcar tarea como completada", description = "Marca una tarea específica como completada")
    @PatchMapping("/mark-completed")
    public ResponseEntity<Object> markTaskAsCompleted(@RequestBody @Validated ChangeTaskStatusDto dto) {
        return taskService.markTaskAsCompleted(dto);
    }

}
