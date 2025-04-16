package utez.edu.mx.back.modules.phases.dto;

import lombok.Data;
import utez.edu.mx.back.modules.phases.model.TypePhase;
import utez.edu.mx.back.modules.tasks.dto.TaskDto;

import java.util.List;

@Data
public class PhaseDto {
    private Long id;
    private TypePhase phase;
    private List<TaskDto> tasks;
}
