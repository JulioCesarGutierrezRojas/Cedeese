package utez.edu.mx.back.modules.projects.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IProjectRepository extends JpaRepository<Project, Long> {
    boolean existsByName(String name);
    boolean existsByIdentifier(String identifier);
    Optional<Project> findByName(String name);
    Optional<Project> findByIdentifier(String identifier);

    @Query("SELECT p FROM Project p JOIN p.employees e WHERE e.id = ?1")
    List<Project> findByEmployeeId(Long employeeId);
}
