package utez.edu.mx.back.modules.tasks.controller;

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
public class TaskController {

    private final TaskService taskService;

    // Crear tarea
    @PostMapping("/")
    public ResponseEntity<Object> createTask(@RequestBody @Validated CreateTaskDto dto) {
        return taskService.createTask(dto);
    }

    // Actualizar tarea
    @PutMapping("/")
    public ResponseEntity<Object> updateTask(@RequestBody @Validated UpdateTaskDto dto) {
        return taskService.updateTask(dto);
    }

    // Eliminar tarea
    @DeleteMapping("/")
    public ResponseEntity<Object> deleteTask(@RequestBody @Validated DeleteTaskDto dto) {
        return taskService.deleteTask(dto);
    }

    // Obtener todas las tareas
    @GetMapping("/")
    public ResponseEntity<Object> getAllTasks() {
        return taskService.getAllTasks();
    }

    // Obtener tarea por ID
    @GetMapping("/one")
    public ResponseEntity<Object> getTaskById(@RequestBody @Validated GetTaskDto dto) {
         return taskService.getTaskById(dto);
    }

    // Cambiar estatus (completado/no completado)
    @PatchMapping("/change-status")
    public ResponseEntity<Object> changeTaskStatus(@RequestBody @Validated ChangeTaskStatusDto dto) {
        return taskService.changeTaskStatus(dto);
    }

    // Obtener tareas por proyecto en su fase actual
    @PostMapping("/project-tasks")
    public ResponseEntity<Object> getTasksByProjectAndCurrentPhase(@RequestBody @Validated GetTasksByProjectDto dto) {
        return taskService.getTasksByProjectAndCurrentPhase(dto);
    }

}
