package utez.edu.mx.back.modules.projects.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for returning limited project information (only status and name)
 * for AP role users
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectLimitedViewDto {
    private Long employeeId;
    private Long projectId;
}