package utez.edu.mx.back.modules.employees.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Object> createEmployee(@RequestBody @Valid CreateEmployeDto dto) {
        return employeeService.createEmployee(dto);
    }

    // Actualizar empleado
    @PostMapping("/update")
    public ResponseEntity<Object> updateEmployee(@RequestBody @Valid UpadateEmployeeDto dto) {
        return employeeService.updateEmployee(dto);
    }

    // Eliminar empleado
    @PostMapping("/delete")
    public ResponseEntity<Object> deleteEmployee(@RequestBody @Valid DeleteEmployeeDto dto) {
        return employeeService.deleteEmployee(dto);
    }

    // Obtener todos los empleados
    @GetMapping("/all")
    public ResponseEntity<Object> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    // Obtener empleado por ID
    @PostMapping("/get-by-id")
    public ResponseEntity<Object> getEmployeeById(@RequestBody @Valid GetEmployeeDto dto) {
        return employeeService.getEmployeeById(dto.getId());
    }

    // Cambiar estatus del empleado
    @PatchMapping("/change-status")
    public ResponseEntity<Object> changeEmployeeStatus(@RequestBody @Valid ChangeEmployeeStatusDto dto) {
        return employeeService.changeEmployeeStatus(dto.getId());
    }


}
