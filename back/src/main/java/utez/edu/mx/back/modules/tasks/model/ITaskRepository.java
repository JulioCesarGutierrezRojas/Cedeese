package utez.edu.mx.back.modules.tasks.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ITaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByPhaseId(Long phaseId);
}
