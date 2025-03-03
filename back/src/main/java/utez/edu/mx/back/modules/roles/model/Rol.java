package utez.edu.mx.back.modules.roles.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import utez.edu.mx.back.modules.employees.model.Employee;

import java.util.List;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeRol rol;

    @OneToMany(mappedBy = "rol")
    @JsonIgnore
    private List<Employee> employees;
}
