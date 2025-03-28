package utez.edu.mx.back.modules.employees.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import utez.edu.mx.back.modules.employees.dto.EmployeesDto;

import java.util.List;
import java.util.Optional;

public interface IEmployeeRepository extends JpaRepository<Employee,Long> {
    Optional<Employee> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    //Devuelve una lista de empleados activos
    @Query("SELECT new utez.edu.mx.back.modules.employees.dto.EmployeesDto(" +
            "e.id, e.username, e.name, e.lastname, e.email, e.status, e.rol.rol) " +
            "FROM Employee e WHERE e.status = true")
    List<EmployeesDto> findAllActiveEmployees();

    //Busca empleados cuyo name contenga el valor dado
    @Query("SELECT e FROM Employee e WHERE UPPER(e.name) LIKE UPPER(concat('%', ?1, '%'))")
    List<Employee> findAllByName(String value);

    //Busca empleados cuyo lastname contenga el valor dado
    @Query("SELECT e FROM Employee e WHERE UPPER(e.lastname) LIKE UPPER(concat('%', ?1, '%'))")
    List<Employee> findAllByLastname(String value);

    //Busca empleados cuyo email contenga el valor dado
    @Query("SELECT e FROM Employee e WHERE UPPER(e.email) LIKE UPPER(concat('%', ?1, '%'))")
    List<Employee> findAllByEmail(String value);
}
