package utez.edu.mx.back.modules.projects.dto;

import lombok.Data;
import utez.edu.mx.back.modules.phases.dto.PhaseDto;

import java.util.Date;

@Data
public class ProjectPhaseDto {
    private Long id;
    private Date startDate;
    private Date endDate;
    private Boolean completed;
    private Long projectId;
    private PhaseDto phase;
}
