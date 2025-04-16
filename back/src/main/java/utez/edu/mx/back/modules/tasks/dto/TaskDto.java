package utez.edu.mx.back.modules.tasks.dto;

import lombok.Data;

@Data
public class TaskDto {
    private Long id;
    private String name;
    private Boolean completed;
    private Long projectId;
    private Long phaseId;
}
