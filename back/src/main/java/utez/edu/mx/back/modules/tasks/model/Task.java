package utez.edu.mx.back.modules.tasks.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import utez.edu.mx.back.modules.phases.model.Phase;
import utez.edu.mx.back.modules.projects.model.Project;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", columnDefinition = "VARCHAR(255)", nullable = false)
    private String name;

    @Column(name = "completed", insertable = false)
    @ColumnDefault("false")
    private Boolean completed;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "phase_id")
    private Phase phase;

    public Task(String name, Boolean completed, Project project, Phase phase) {
        this.name = name;
        this.completed = completed;
        this.project = project;
        this.phase = phase;
    }
}