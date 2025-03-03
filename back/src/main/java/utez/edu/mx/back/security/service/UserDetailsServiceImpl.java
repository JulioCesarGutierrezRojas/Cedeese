package utez.edu.mx.back.security.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.back.modules.employees.model.Employee;
import utez.edu.mx.back.modules.employees.service.EmployeeService;
import utez.edu.mx.back.security.model.UserDetailsImpl;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserDetailsServiceImpl implements UserDetailsService {
    private final EmployeeService service;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Employee> foundEmployee = service.findByUsername(username);
        if (foundEmployee.isPresent())
            return UserDetailsImpl.build(foundEmployee.get());

        throw new UsernameNotFoundException("UserNotFound");
    }
}
