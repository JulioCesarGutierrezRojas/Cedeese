package utez.edu.mx.back.security.model;

import lombok.Builder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import utez.edu.mx.back.modules.employees.model.Employee;
import utez.edu.mx.back.modules.roles.model.Rol;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Builder
public class UserDetailsImpl implements UserDetails {
    private String username;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    public static UserDetailsImpl build(Employee employee) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        Rol rol = employee.getRol();
        authorities.add(new SimpleGrantedAuthority(rol.getRol().name()));

        return UserDetailsImpl.builder()
                .username(employee.getUsername())
                .password(employee.getPassword())
                .authorities(authorities)
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
}
