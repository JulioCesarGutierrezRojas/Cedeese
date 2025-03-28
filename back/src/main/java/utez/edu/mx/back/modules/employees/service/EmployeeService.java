package utez.edu.mx.back.modules.employees.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.kernel.TypesResponse;
import utez.edu.mx.back.modules.employees.dto.EmployeesDto;
import utez.edu.mx.back.modules.employees.model.Employee;
import utez.edu.mx.back.modules.employees.model.IEmployeeRepository;
import utez.edu.mx.back.modules.roles.model.IRolRepository;
import utez.edu.mx.back.modules.roles.model.Rol;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class EmployeeService {
    private final IEmployeeRepository repository;
    private final IRolRepository rolRepository;


    @Transactional(rollbackFor = SQLException.class)
    public ResponseEntity<ApiResponse<EmployeesDto>> createEmployee(EmployeesDto employeeDto) {
        // Validar username único
        if (repository.existsByUsername(employeeDto.getUsername())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(null, TypesResponse.WARNING, "El nombre de usuario ya está registrado"));
        }

        // Validar email único
        if (repository.existsByEmail(employeeDto.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(null, TypesResponse.WARNING, "El correo electrónico ya está registrado"));
        }

        // Obtener o crear el rol
        Rol rol = rolRepository.findByRol(employeeDto.getRol())
                .orElseGet(() -> {
                    Rol newRol = new Rol();
                    newRol.setRol(employeeDto.getRol());
                    return rolRepository.save(newRol);
                });

        // Crear entidad Employee
        Employee employee = new Employee();
        employee.setUsername(employeeDto.getUsername());
        employee.setPassword(employeeDto.getPassword());
        employee.setName(employeeDto.getName());
        employee.setLastname(employeeDto.getLastname());
        employee.setEmail(employeeDto.getEmail());
        employee.setStatus(true); // Por defecto activo
        employee.setRol(rol);

        // Guardar en base de datos
        Employee savedEmployee = repository.save(employee);

        // Convertir a DTO para respuesta
        EmployeesDto responseDto = convertToDto(savedEmployee);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(responseDto, TypesResponse.SUCCESS, "Empleado creado exitosamente"));
    }


    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<EmployeesDto>>> getAllActiveEmployees() {
        List<EmployeesDto> activeEmployees = repository.findAllActiveEmployees();

        if (activeEmployees.isEmpty()) {
            return ResponseEntity
                    .ok(new ApiResponse<>(null, TypesResponse.WARNING, "No se encontraron empleados activos"));
        }

        return ResponseEntity
                .ok(new ApiResponse<>(activeEmployees, TypesResponse.SUCCESS, "Empleados activos obtenidos"));
    }


    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<EmployeesDto>> getEmployeeById(Long id) {
        Optional<Employee> employeeOptional = repository.findById(id);

        if (employeeOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(null, TypesResponse.WARNING, "Empleado no encontrado"));
        }

        EmployeesDto responseDto = convertToDto(employeeOptional.get());
        return ResponseEntity
                .ok(new ApiResponse<>(responseDto, TypesResponse.SUCCESS, "Empleado encontrado"));
    }


    @Transactional(rollbackFor = SQLException.class)
    public ResponseEntity<ApiResponse<EmployeesDto>> updateEmployee(EmployeesDto employeeDto) {
        // Verificar si el empleado existe
        Optional<Employee> employeeOptional = repository.findById(employeeDto.getId());
        if (employeeOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(null, TypesResponse.WARNING, "Empleado no encontrado"));
        }

        Employee employee = employeeOptional.get();

        // Validar username único (si cambió)
        if (!employee.getUsername().equals(employeeDto.getUsername()) &&
                repository.existsByUsername(employeeDto.getUsername())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(null, TypesResponse.WARNING, "El nombre de usuario ya está en uso"));
        }

        // Validar email único (si cambió)
        if (!employee.getEmail().equals(employeeDto.getEmail()) &&
                repository.existsByEmail(employeeDto.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(null, TypesResponse.WARNING, "El correo electrónico ya está en uso"));
        }

        // Obtener o crear el rol
        Rol rol = rolRepository.findByRol(employeeDto.getRol())
                .orElseGet(() -> {
                    Rol newRol = new Rol();
                    newRol.setRol(employeeDto.getRol());
                    return rolRepository.save(newRol);
                });

        // Actualizar datos
        employee.setUsername(employeeDto.getUsername());
        employee.setPassword(employeeDto.getPassword());
        employee.setName(employeeDto.getName());
        employee.setLastname(employeeDto.getLastname());
        employee.setEmail(employeeDto.getEmail());
        employee.setRol(rol);

        // Guardar cambios
        Employee updatedEmployee = repository.save(employee);

        // Convertir a DTO para respuesta
        EmployeesDto responseDto = convertToDto(updatedEmployee);

        return ResponseEntity
                .ok(new ApiResponse<>(responseDto, TypesResponse.SUCCESS, "Empleado actualizado exitosamente"));
    }


    @Transactional(rollbackFor = SQLException.class)
    public ResponseEntity<ApiResponse<EmployeesDto>> changeEmployeeStatus(Long id) {
        Optional<Employee> employeeOptional = repository.findById(id);

        if (employeeOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(null, TypesResponse.WARNING, "Empleado no encontrado"));
        }

        Employee employee = employeeOptional.get();
        employee.setStatus(!employee.getStatus());

        Employee updatedEmployee = repository.save(employee);

        String message = updatedEmployee.getStatus() ?
                "Empleado activado correctamente" : "Empleado desactivado correctamente";

        EmployeesDto responseDto = convertToDto(updatedEmployee);

        return ResponseEntity
                .ok(new ApiResponse<>(responseDto, TypesResponse.SUCCESS, message));
    }


    /*
    // Metodo para buscar empleados por nombre, apellido o email ---> No definido
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<Employee>>> searchEmployees(String searchTerm) {
        List<Employee> byName = repository.findAllByName(searchTerm);
        List<Employee> byLastname = repository.findAllByLastname(searchTerm);
        List<Employee> byEmail = repository.findAllByEmail(searchTerm);

        // Combinar resultados sin duplicados
        List<Employee> results = Stream.of(byName, byLastname, byEmail)
                .flatMap(List::stream)
                .distinct()
                .collect(Collectors.toList());

        if (results.isEmpty()) {
            return ResponseEntity
                    .ok(new ApiResponse<>(null, TypesResponse.WARNING, "No se encontraron empleados"));
        }

        return ResponseEntity
                .ok(new ApiResponse<>(results, TypesResponse.SUCCESS, "Empleados encontrados"));
    }
    */


    private EmployeesDto convertToDto(Employee employee) {
        return new EmployeesDto(
                employee.getId(),
                employee.getUsername(),
                employee.getName(),
                employee.getLastname(),
                employee.getEmail(),
                employee.getStatus(),
                employee.getRol() != null ? employee.getRol().getRol() : null
        );
    }

}
