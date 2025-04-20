package utez.edu.mx.back.modules.projects.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import utez.edu.mx.back.modules.employees.model.Employee;
import utez.edu.mx.back.modules.tasks.model.Task;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", columnDefinition = "VARCHAR(255)", nullable = false)
    private String name;

    @Column(name = "identifier", columnDefinition = "VARCHAR(255)", nullable = false, unique = true)
    private String identifier;

    @Column(name = "start_date", columnDefinition = "DATE", nullable = false)
    private Date startDate;

    @Column(name = "end_date", columnDefinition = "DATE")
    private Date endDate;

    @Column(name = "status", insertable = false)
    @ColumnDefault("true")
    private Boolean status;

    @ManyToMany
    @JoinTable(
            name = "project_has_employees",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private List<Employee> employees;

    @OneToMany(mappedBy = "project")
    @JsonIgnore
    private List<ProjectPhase> projectPhases;

    @OneToMany(mappedBy = "project")
    @JsonIgnore
    private List<Task> tasks;

    public Project(String name, String identifier, Date startDate, Date endDate, Boolean status) {
        this.name = name;
        this.identifier = identifier;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }
}
