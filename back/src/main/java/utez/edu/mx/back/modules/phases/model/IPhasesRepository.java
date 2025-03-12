package utez.edu.mx.back.modules.phases.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IPhasesRepository extends JpaRepository<Phase, Long> {
    Optional<Phase> findByPhase(TypePhase phase);
    boolean existsByPhase(TypePhase phase);
}
