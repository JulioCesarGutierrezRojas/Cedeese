package utez.edu.mx.back.modules.phases.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import utez.edu.mx.back.modules.employees.model.Employee;
import utez.edu.mx.back.modules.projects.model.Project;
import utez.edu.mx.back.modules.projects.model.ProjectPhase;
import utez.edu.mx.back.modules.tasks.model.Task;

import java.util.List;

@Entity
@Table(name = "phases")
@Data
@NoArgsConstructor
public class Phase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypePhase phase;

    @OneToMany(mappedBy = "phase")
    @JsonIgnore
    private List<ProjectPhase> projectPhases;

    @OneToMany(mappedBy = "phase")
    @JsonIgnore
    private List<Task> tasks;
}
