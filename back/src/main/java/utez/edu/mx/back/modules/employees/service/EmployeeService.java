package utez.edu.mx.back.modules.employees.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.kernel.TypesResponse;
import utez.edu.mx.back.modules.employees.model.Employee;
import utez.edu.mx.back.modules.employees.model.IEmployeeRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class EmployeeService {
    private final IEmployeeRepository repository;

    @Transactional(readOnly = true)
    public Optional<Employee> findByUsername(String username) {
        return repository.findByUsername(username);
    }

    // Traer todos los empleados
    @Transactional(readOnly = true)
    public ApiResponse<List<Employee>> getAllEmployees() {
        List<Employee> employees = repository.findAll();
        return new ApiResponse<>(employees, TypesResponse.SUCCESS, "Lista de empleados obtenida correctamente");
    }

    // Traer un empleado por id
    @Transactional(readOnly = true)
    public ApiResponse<Employee> getEmployeeById(Long id) {
        return repository.findById(id)
                .map(employee -> new ApiResponse<>(employee, TypesResponse.SUCCESS, "Empleado encontrado"))
                .orElseGet(() -> new ApiResponse<>(TypesResponse.ERROR, "Empleado no encontrado"));
    }

    // Registrar un empleado
    public ApiResponse<Employee> saveEmployee(Employee employee) {
        if (repository.existsByEmail(employee.getEmail())) {
            return new ApiResponse<>(TypesResponse.ERROR, "El correo ya está registrado");
        }
        Employee savedEmployee = repository.save(employee);
        return new ApiResponse<>(savedEmployee, TypesResponse.SUCCESS, "Empleado registrado correctamente");
    }

    // Actualizar un empleado
    public ApiResponse<Employee> updateEmployee(Long id, Employee employee) {
        if (!repository.existsById(id)) {
            return new ApiResponse<>(TypesResponse.ERROR, "Empleado no encontrado");
        }
        employee.setId(id);
        Employee updatedEmployee = repository.save(employee);
        return new ApiResponse<>(updatedEmployee, TypesResponse.SUCCESS, "Empleado actualizado correctamente");
    }

    // Eliminar un empleado
    public ApiResponse<Void> deleteEmployee(Long id) {
        if (!repository.existsById(id)) {
            return new ApiResponse<>(TypesResponse.ERROR, "Empleado no encontrado");
        }
        repository.deleteById(id);
        return new ApiResponse<>(TypesResponse.SUCCESS, "Empleado eliminado correctamente");
    }

}
