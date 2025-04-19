package utez.edu.mx.back.modules.employees.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import utez.edu.mx.back.modules.projects.model.Project;
import utez.edu.mx.back.modules.roles.model.Rol;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", columnDefinition = "VARCHAR(255)", nullable = false, unique = true)
    private String username;

    @Column(name = "password", columnDefinition = "VARCHAR(255)", nullable = false)
    private String password;

    @Column(name = "name", columnDefinition = "VARCHAR(255)", nullable = false)
    private String name;

    @Column(name = "lastname", columnDefinition = "VARCHAR(255)", nullable = false)
    private String lastname;

    @Column(name = "email", columnDefinition = "VARCHAR(255)", nullable = false)
    private String email;

    @Column(name = "status", insertable = false)
    @ColumnDefault("true")
    private Boolean status;

    @Column(name = "reset_token", columnDefinition = "VARCHAR(5)")
    private String resetToken;

    @Column(name = "reset_token_expiration")
    @Temporal(TemporalType.TIMESTAMP)
    private Date resetTokenExpiration;

    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;

    @ManyToMany(mappedBy = "employees", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Project> projects;
}