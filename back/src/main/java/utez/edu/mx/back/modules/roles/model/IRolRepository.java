package utez.edu.mx.back.modules.roles.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IRolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByRol(TypeRol rol);
    boolean existsByRol(TypeRol rol);
}
