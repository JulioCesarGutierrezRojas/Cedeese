package utez.edu.mx.back.modules.employees.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.back.modules.employees.controller.dto.*;
import utez.edu.mx.back.modules.employees.service.EmployeeService;


@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Empleados", description = "Endpoints de API para la gestión de empleados")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Operation(summary = "Crear empleado", description = "Crea un nuevo empleado en el sistema")
    @PostMapping("/")
    public ResponseEntity<Object> createEmployee(@RequestBody @Validated CreateEmployeDto dto) {
        return employeeService.createEmployee(dto);
    }

    @Operation(summary = "Actualizar empleado", description = "Actualiza la información de un empleado existente")
    @PutMapping("/")
    public ResponseEntity<Object> updateEmployee(@RequestBody @Validated UpadateEmployeeDto dto) {
        return employeeService.updateEmployee(dto);
    }

    @Operation(summary = "Eliminar empleado", description = "Elimina un empleado del sistema")
    @DeleteMapping("/")
    public ResponseEntity<Object> deleteEmployee(@RequestBody @Validated DeleteEmployeeDto dto) {
        return employeeService.deleteEmployee(dto);
    }

    @Operation(summary = "Obtener todos los empleados", description = "Recupera una lista de todos los empleados")
    @GetMapping("/")
    public ResponseEntity<Object> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @Operation(summary = "Obtener empleado por ID", description = "Recupera un empleado específico por su ID")
    @PostMapping("/one")
    public ResponseEntity<Object> getEmployeeById(@RequestBody @Validated GetEmployeeDto dto) {
        return employeeService.getEmployeeById(dto);
    }

    @Operation(summary = "Cambiar estado del empleado", description = "Actualiza el estado de un empleado (activo/inactivo)")
    @PatchMapping("/change-status")
    public ResponseEntity<Object> changeEmployeeStatus(@RequestBody @Validated ChangeEmployeeStatusDto dto) {
        return employeeService.changeEmployeeStatus(dto);
    }


}
