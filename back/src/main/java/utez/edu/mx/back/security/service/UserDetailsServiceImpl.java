package utez.edu.mx.back.security.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.back.modules.employees.model.Employee;
import utez.edu.mx.back.modules.employees.model.IEmployeeRepository;
import utez.edu.mx.back.modules.employees.service.EmployeeService;
import utez.edu.mx.back.security.model.UserDetailsImpl;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserDetailsServiceImpl implements UserDetailsService {
    private final IEmployeeRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Employee foundEmployee = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        if (!foundEmployee.getStatus())
            throw new DisabledException("El usuario esta deshabilitado");

        return UserDetailsImpl.build(foundEmployee);
    }
}
