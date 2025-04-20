package utez.edu.mx.back.modules.phases.controller.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para mover un proyecto a la siguiente fase
 */
@Data
@NoArgsConstructor
public class MoveToNextPhaseDto {
    private Long projectId;
    private Long currentPhaseId;
}