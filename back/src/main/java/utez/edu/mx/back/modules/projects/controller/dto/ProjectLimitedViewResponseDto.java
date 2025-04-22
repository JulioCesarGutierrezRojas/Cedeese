package utez.edu.mx.back.modules.projects.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO containing only the project name and status
 * for AP role users
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectLimitedViewResponseDto {
    private String name;
    private Boolean status;
}