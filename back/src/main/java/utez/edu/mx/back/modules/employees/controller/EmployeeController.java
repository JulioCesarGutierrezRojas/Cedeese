package utez.edu.mx.back.modules.employees.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.modules.employees.dto.EmployeesDto;
import utez.edu.mx.back.modules.employees.service.EmployeeService;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<EmployeesDto>>> getAllActiveEmployees() {
        return employeeService.getAllActiveEmployees();
    }

    @PostMapping("/get")
    public ResponseEntity<ApiResponse<EmployeesDto>> getEmployeeById(@RequestBody EmployeesDto employeeDto) {
        return employeeService.getEmployeeById(employeeDto.getId());
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<EmployeesDto>> createEmployee(@RequestBody EmployeesDto employeeDto) {
        return employeeService.createEmployee(employeeDto);
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<EmployeesDto>> updateEmployee(@RequestBody EmployeesDto employeeDto) {
        return employeeService.updateEmployee(employeeDto);
    }

    @PostMapping("/change-status")
    public ResponseEntity<ApiResponse<EmployeesDto>> changeEmployeeStatus(@RequestBody EmployeesDto employeeDto) {
        return employeeService.changeEmployeeStatus(employeeDto.getId());
    }

    /* Metodo no definido aún
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<EmployeesDto>>> search(@RequestParam String term) {
        return employeeService.searchEmployees(term);
    }
    */

    //Es obligatorio agregar el @Validated?
}
