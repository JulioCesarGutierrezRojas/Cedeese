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

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class EmployeeService {
    private final IEmployeeRepository repository;
    private final IRolRepository rolRepository;

    @Transactional(rollbackFor = SQLException.class)
    public ResponseEntity<Object> createEmployee(CreateEmployeDto dto) {

        // Validar existencia de username
        if (repository.existsByUsername(dto.getUsername())) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El nombre de usuario ya está registrado"),
                    HttpStatus.BAD_REQUEST
            );
        }

        // Validar existencia de email
        if (repository.existsByEmail(dto.getEmail())) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El correo electrónico ya está registrado"),
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

        // Crear entidad
        Employee employee = new Employee();
        employee.setUsername(dto.getUsername());
        employee.setPassword(dto.getPassword());
        employee.setName(dto.getName());
        employee.setLastname(dto.getLastname());
        employee.setEmail(dto.getEmail());
        employee.setStatus(true);
        employee.setRol(rol);

        // Guardar en base de datos
        Employee saved = repository.save(employee);

        // Crear DTO de respuesta
        GetEmployeeDto responseDto = new GetEmployeeDto();
        responseDto.setId(saved.getId());
        responseDto.setUsername(saved.getUsername());
        responseDto.setName(saved.getName());
        responseDto.setLastname(saved.getLastname());
        responseDto.setEmail(saved.getEmail());
        responseDto.setStatus(saved.getStatus());

        return new ResponseEntity<>(
                new ApiResponse<>(responseDto, TypesResponse.SUCCESS, "Empleado creado exitosamente"),
                HttpStatus.CREATED
        );
    }


    @Transactional(rollbackFor = SQLException.class)
    public ResponseEntity<Object> updateEmployee(UpadateEmployeeDto dto) {

        // Buscar empleado por ID
        Optional<Employee> optionalEmployee = repository.findById(dto.getId());
        if (optionalEmployee.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "El empleado no existe"),
                    HttpStatus.NOT_FOUND
            );
        }

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
        Employee updated = repository.save(existingEmployee);

        // Crear respuesta
        GetEmployeeDto responseDto = new GetEmployeeDto();
        responseDto.setId(updated.getId());
        responseDto.setUsername(updated.getUsername());
        responseDto.setName(updated.getName());
        responseDto.setLastname(updated.getLastname());
        responseDto.setEmail(updated.getEmail());
        responseDto.setStatus(updated.getStatus());

        return new ResponseEntity<>(
                new ApiResponse<>(responseDto, TypesResponse.SUCCESS, "Empleado actualizado correctamente"),
                HttpStatus.OK
        );
    }


    @Transactional(rollbackFor = SQLException.class)
    public ResponseEntity<Object> deleteEmployee(DeleteEmployeeDto dto) {

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

        List<GetEmployeeDto> dtoList = employees.stream().map(employee -> {
            GetEmployeeDto dto = new GetEmployeeDto();
            dto.setId(employee.getId());
            dto.setUsername(employee.getUsername());
            dto.setName(employee.getName());
            dto.setLastname(employee.getLastname());
            dto.setEmail(employee.getEmail());
            dto.setStatus(employee.getStatus());
            return dto;
        }).collect(Collectors.toList());

        return new ResponseEntity<>(
                new ApiResponse<>(dtoList, TypesResponse.SUCCESS, "Lista de empleados"),
                HttpStatus.OK
        );
    }


    @Transactional(readOnly = true)
    public ResponseEntity<Object> getEmployeeById(Long id) {
        Optional<Employee> optionalEmployee = repository.findById(id);

        if (optionalEmployee.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "Empleado no encontrado"),
                    HttpStatus.NOT_FOUND
            );
        }

        Employee employee = optionalEmployee.get();
        GetEmployeeDto dto = new GetEmployeeDto();
        dto.setId(employee.getId());
        dto.setUsername(employee.getUsername());
        dto.setName(employee.getName());
        dto.setLastname(employee.getLastname());
        dto.setEmail(employee.getEmail());
        dto.setStatus(employee.getStatus());

        return new ResponseEntity<>(
                new ApiResponse<>(dto, TypesResponse.SUCCESS, "Empleado encontrado"),
                HttpStatus.OK
        );
    }


    @Transactional(rollbackFor = SQLException.class)
    public ResponseEntity<Object> changeEmployeeStatus(Long id) {
        Optional<Employee> optionalEmployee = repository.findById(id);

        if (optionalEmployee.isEmpty()) {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.WARNING, "Empleado no encontrado"),
                    HttpStatus.NOT_FOUND
            );
        }

        Employee employee = optionalEmployee.get();
        Boolean currentStatus = employee.getStatus();
        employee.setStatus(!currentStatus); // alterna el estado: true -> false, false -> true

        repository.save(employee);

        String message = currentStatus ? "Empleado desactivado" : "Empleado activado";

        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.SUCCESS, message),
                HttpStatus.OK
        );
    }
}
