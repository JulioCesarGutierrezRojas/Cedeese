package utez.edu.mx.back.modules.projects.model;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IProjectPhaseRepository extends JpaRepository<ProjectPhase, Long> {
    List<ProjectPhase> findByProjectId(Long projectId);
}
