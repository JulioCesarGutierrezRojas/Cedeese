package utez.edu.mx.back.modules.tasks.controller.dto;

import lombok.Data;

@Data
public class GetTaskDto {
    private Long id;
    private String name;
    private Boolean completed;
    private Long projectId;
    private Long phaseId;
}
