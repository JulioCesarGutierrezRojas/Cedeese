package utez.edu.mx.back.modules.employees.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.back.modules.employees.model.Employee;
import utez.edu.mx.back.modules.employees.model.IEmployeeRepository;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class EmployeeService {
    private final IEmployeeRepository repository;

}
