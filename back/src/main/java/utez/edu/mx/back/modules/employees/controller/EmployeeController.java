package utez.edu.mx.back.modules.employees.controller;

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
public class EmployeeController {

    private final EmployeeService employeeService;

    // Crear empleado
    @PostMapping("/")
    public ResponseEntity<Object> createEmployee(@RequestBody @Validated CreateEmployeDto dto) {
        return employeeService.createEmployee(dto);
    }

    // Actualizar empleado
    @PutMapping("/")
    public ResponseEntity<Object> updateEmployee(@RequestBody @Validated UpadateEmployeeDto dto) {
        return employeeService.updateEmployee(dto);
    }

    // Eliminar empleado
    @DeleteMapping("/")
    public ResponseEntity<Object> deleteEmployee(@RequestBody @Validated DeleteEmployeeDto dto) {
        return employeeService.deleteEmployee(dto);
    }

    // Obtener todos los empleados
    @GetMapping("/")
    public ResponseEntity<Object> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    // Obtener empleado por ID
    @PostMapping("/one")
    public ResponseEntity<Object> getEmployeeById(@RequestBody @Validated GetEmployeeDto dto) {
        return employeeService.getEmployeeById(dto);
    }

    // Cambiar estatus del empleado
    @PatchMapping("/change-status")
    public ResponseEntity<Object> changeEmployeeStatus(@RequestBody @Validated ChangeEmployeeStatusDto dto) {
        return employeeService.changeEmployeeStatus(dto);
    }


}
