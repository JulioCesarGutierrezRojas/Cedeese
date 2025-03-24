package utez.edu.mx.back.modules.employees.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IEmployeeRepository extends JpaRepository<Employee,Long> {
    Optional<Employee> findByEmail(String email);
    boolean existsByEmail(String email);
}
