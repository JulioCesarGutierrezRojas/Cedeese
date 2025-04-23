package utez.edu.mx.back.modules.employees.service;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.kernel.TypesResponse;
import utez.edu.mx.back.modules.employees.controller.dto.*;
import utez.edu.mx.back.modules.employees.model.Employee;
import utez.edu.mx.back.modules.employees.model.IEmployeeRepository;
import utez.edu.mx.back.modules.roles.model.IRolRepository;
import utez.edu.mx.back.modules.roles.model.Rol;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.SQLException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class EmployeeService {
    private final IEmployeeRepository repository;
    private final IRolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(rollbackFor = SQLException.class)
    public ResponseEntity<Object> createEmployee(CreateEmployeDto dto) {

        // Validar existencia de username
        if (repository.existsByUsername(dto.getUsername()))
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El nombre de usuario ya está registrado"),
                    HttpStatus.BAD_REQUEST
            );

        // Validar existencia de email
        if (repository.existsByEmail(dto.getEmail()))
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El correo electrónico ya está registrado"),
                    HttpStatus.BAD_REQUEST
            );

        // Validar formato de email
        if (!dto.getEmail().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"))
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El formato del correo electrónico no es válido"),
                    HttpStatus.BAD_REQUEST
            );

        // Validar longitud de username (mínimo 3 caracteres)
        if (dto.getUsername().length() < 3)
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El nombre de usuario debe tener al menos 3 caracteres"),
                    HttpStatus.BAD_REQUEST
            );

        // Validar longitud de password (mínimo 6 caracteres)
        if (dto.getPassword().length() < 8) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "La contraseña debe tener al menos 6 caracteres"),
                    HttpStatus.BAD_REQUEST
            );
        }

        // Buscar el rol
        Optional<Rol> optionalRol = rolRepository.findById(dto.getRolId());
        if (optionalRol.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El rol especificado no existe"),
                    HttpStatus.BAD_REQUEST
            );
        }

        Rol rol = optionalRol.get();

        // Encriptar la contraseña
        String encryptedPassword = passwordEncoder.encode(dto.getPassword());

        // Crear entidad
        Employee employee = new Employee(dto.getUsername(), encryptedPassword, dto.getName(), dto.getLastname(), dto.getEmail(), true, rol);

        // Guardar en base de datos
        repository.save(employee);

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Empleado creado exitosamente"),
                HttpStatus.CREATED
        );
    }


    @Transactional(rollbackFor = SQLException.class)
    public ResponseEntity<Object> updateEmployee(UpadateEmployeeDto dto) {

        // Buscar empleado por ID
        Optional<Employee> optionalEmployee = repository.findById(dto.getId());
        if (optionalEmployee.isEmpty())
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El empleado no existe"),
                    HttpStatus.NOT_FOUND
            );

        Employee existingEmployee = optionalEmployee.get();

        // Validar si otro usuario tiene el mismo username
        if (repository.existsByUsernameAndIdNot(dto.getUsername(), dto.getId())) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El nombre de usuario ya está registrado por otro usuario"),
                    HttpStatus.BAD_REQUEST
            );
        }

        // Validar si otro usuario tiene el mismo email
        if (repository.existsByEmailAndIdNot(dto.getEmail(), dto.getId())) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El correo electrónico ya está registrado por otro usuario"),
                    HttpStatus.BAD_REQUEST
            );
        }

        // Obtener el nuevo rol
        Optional<Rol> optionalRol = rolRepository.findById(dto.getRolId());
        if (optionalRol.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El rol especificado no existe"),
                    HttpStatus.BAD_REQUEST
            );
        }

        Rol rol = optionalRol.get();

        // Actualizar campos
        existingEmployee.setId(dto.getId());
        existingEmployee.setUsername(dto.getUsername());
        existingEmployee.setName(dto.getName());
        existingEmployee.setLastname(dto.getLastname());
        existingEmployee.setEmail(dto.getEmail());
        existingEmployee.setRol(rol);

        // Guardar cambios
        repository.save(existingEmployee);

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Empleado actualizado correctamente"),
                HttpStatus.OK
        );
    }


    @Transactional(rollbackFor = SQLException.class)
    public ResponseEntity<Object> deleteEmployee(DeleteEmployeeDto dto) {
        System.out.println("dto: ", dto);
        
        // Buscar empleado por ID
        Optional<Employee> optionalEmployee = repository.findById(dto.getId());
        if (optionalEmployee.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El empleado no existe"),
                    HttpStatus.NOT_FOUND
            );
        }

        // Eliminar empleado
        repository.deleteById(dto.getId());

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Empleado eliminado correctamente"),
                HttpStatus.OK
        );
    }


    @Transactional(readOnly = true)
    public ResponseEntity<Object> getAllEmployees() {
        List<Employee> employees = repository.findAll();

        return new ResponseEntity<>(
                new ApiResponse<>(employees, TypesResponse.SUCCESS, "Lista de empleados"),
                HttpStatus.OK
        );
    }


    @Transactional(readOnly = true)
    public ResponseEntity<Object> getEmployeeById(GetEmployeeDto dto) {
        Employee foundEmployee = repository.findById(dto.getId()).orElse(null);

        if (Objects.isNull(foundEmployee))
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "Empleado no encontrado"),
                    HttpStatus.NOT_FOUND
            );

        return new ResponseEntity<>(
                new ApiResponse<>(foundEmployee, TypesResponse.SUCCESS, "Empleado encontrado"),
                HttpStatus.OK
        );
    }


    @Transactional(rollbackFor = SQLException.class)
    public ResponseEntity<Object> changeEmployeeStatus(ChangeEmployeeStatusDto dto) {
        Employee foundEmployee = repository.findById(dto.getId()).orElse(null);

        if (Objects.isNull(foundEmployee))
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "Empleado no encontrado"),
                    HttpStatus.NOT_FOUND
            );

        foundEmployee.setStatus(!foundEmployee.getStatus());

        repository.save(foundEmployee);

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, "Estado del empleado actualizado correctamente" ),
                HttpStatus.OK
        );
    }
}
