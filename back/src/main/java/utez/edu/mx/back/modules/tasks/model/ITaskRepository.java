package utez.edu.mx.back.modules.tasks.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ITaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByPhaseId(Long phaseId);
    // Buscar por nombre (ignora mayúsculas/minúsculas y busca "por contiene")
    List<Task> findByNameContainingIgnoreCase(String name);

    // Buscar solo tareas completadas o no
    List<Task> findByCompleted(boolean completed);

    // Buscar por proyecto Y fase
    List<Task> findByProjectIdAndPhaseId(Long projectId, Long phaseId);
}
