package utez.edu.mx.back.modules.tasks.service;

import org.springframework.stereotype.Service;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.kernel.TypesResponse;
import utez.edu.mx.back.modules.tasks.model.ITaskRepository;
import utez.edu.mx.back.modules.tasks.model.Task;


import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private ITaskRepository iTaskRepository;

    // Obtener todas las tareas
    public ApiResponse<List<Task>> getAllTasks() {
        List<Task> tasks = iTaskRepository.findAll();
        return new ApiResponse<>(tasks, TypesResponse.SUCCESS, "Lista de tareas obtenida correctamente.");
    }


    // Obtener tarea por ID
    public ApiResponse<Task> getTaskById(Long id) {
        Optional<Task> task = iTaskRepository.findById(id);
        return task.map(value -> new ApiResponse<>(value, TypesResponse.SUCCESS, "Tarea encontrada."))
                .orElseGet(() -> new ApiResponse<>(TypesResponse.ERROR, "Tarea no encontrada."));
    }


    // Crear una nueva tarea
    public ApiResponse<Task> createTask(Task task) {
        Task newTask = iTaskRepository.save(task);
        return new ApiResponse<>(newTask, TypesResponse.SUCCESS, "Tarea creada correctamente.");
    }


    // Actualizar una tarea existente
    public ApiResponse<Task> updateTask(Long id, Task taskDetails) {
        Optional<Task> task = iTaskRepository.findById(id);
        if (task.isPresent()) {
            Task existingTask = task.get();
            existingTask.setName(taskDetails.getName());
            existingTask.setCompleted(taskDetails.getCompleted());
            existingTask.setProject(taskDetails.getProject());
            existingTask.setPhase(taskDetails.getPhase());

            iTaskRepository.save(existingTask);
            return new ApiResponse<>(existingTask, TypesResponse.SUCCESS, "Tarea actualizada correctamente.");
        } else {
            return new ApiResponse<>(TypesResponse.ERROR, "Tarea no encontrada.");
        }
    }


    // Eliminar una tarea
    public ApiResponse<Void> deleteTask(Long id) {
        Optional<Task> task = iTaskRepository.findById(id);
        if (task.isPresent()) {
            iTaskRepository.deleteById(id);
            return new ApiResponse<>(TypesResponse.SUCCESS, "Tarea eliminada correctamente.");
        } else {
            return new ApiResponse<>(TypesResponse.ERROR, "Tarea no encontrada.");
        }
    }


}
