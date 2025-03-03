package utez.edu.mx.back.modules.projects.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import utez.edu.mx.back.modules.phases.model.Phase;

import java.util.Date;

@Entity
@Table(name = "project_has_phases")
@Data
@NoArgsConstructor
public class ProjectPhase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "start_date", columnDefinition = "DATE", nullable = false)
    private Date startDate;

    @Column(name = "end_date", columnDefinition = "DATE")
    private Date endDate;

    @Column(name = "completed", insertable = false)
    @ColumnDefault("false")
    private Boolean completed;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "phase_id")
    private Phase phase;
}
