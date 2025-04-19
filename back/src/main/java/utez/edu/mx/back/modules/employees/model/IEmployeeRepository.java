package utez.edu.mx.back.modules.employees.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IEmployeeRepository extends JpaRepository<Employee,Long> {
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByResetToken(String resetToken);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByUsernameAndIdNot(String username, Long id);
    boolean existsByEmailAndIdNot(String email, Long id);


    //Busca empleados cuyo name contenga el valor dado
    @Query("SELECT e FROM Employee e WHERE UPPER(e.name) LIKE UPPER(concat('%', ?1, '%'))")
    List<Employee> findAllByName(String value);

    //Busca empleados cuyo lastname contenga el valor dado
    @Query("SELECT e FROM Employee e WHERE UPPER(e.lastname) LIKE UPPER(concat('%', ?1, '%'))")
    List<Employee> findAllByLastname(String value);

    //Busca empleados cuyo email contenga el valor dado
    @Query("SELECT e FROM Employee e WHERE UPPER(e.email) LIKE UPPER(concat('%', ?1, '%'))")
    List<Employee> findAllByEmail(String value);


    //mandarlos paginados, el pagiable tiene que venir de spring
}
