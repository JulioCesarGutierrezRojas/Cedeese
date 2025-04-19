package utez.edu.mx.back.modules.tasks.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Object> createTask(@RequestBody @Valid CreateTaskDto dto) {
        return taskService.createTask(dto);
    }

    // Actualizar tarea
    @PostMapping("/update")
    public ResponseEntity<Object> updateTask(@RequestBody @Valid UpdateTaskDto dto) {
        return taskService.updateTask(dto);
    }

    // Eliminar tarea
    @PostMapping("/delete")
    public ResponseEntity<Object> deleteTask(@RequestBody @Valid DeleteTaskDto dto) {
        return taskService.deleteTask(dto);
    }

    // Obtener todas las tareas
    @GetMapping("/all")
    public ResponseEntity<Object> getAllTasks() {
        return taskService.getAllTasks();
    }

    // Obtener tarea por ID
    @PostMapping("/get-by-id")
    public ResponseEntity<Object> getTaskById(@RequestBody @Valid GetTaskDto dto) {
        return taskService.getTaskById(dto.getId());
    }

    // Cambiar estatus (completado/no completado)
    @PatchMapping("/change-status")
    public ResponseEntity<Object> changeTaskStatus(@RequestBody @Valid ChangeTaskStatusDto dto) {
        return taskService.changeTaskStatus(dto.getId(), dto.getStatus());
    }

}
