package utez.edu.mx.back.modules.phases.dto;

import lombok.Data;
import utez.edu.mx.back.modules.phases.model.TypePhase;
import utez.edu.mx.back.modules.tasks.controller.dto.GetTaskDto;

import java.util.List;

@Data
public class PhaseDto {
    private Long id;
    private TypePhase phase;
    private List<GetTaskDto> tasks;
}
