package utez.edu.mx.back.modules.phases.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.kernel.TypesResponse;
import utez.edu.mx.back.modules.phases.model.IPhasesRepository;
import utez.edu.mx.back.modules.phases.model.Phase;
import utez.edu.mx.back.modules.phases.model.TypePhase;
import utez.edu.mx.back.modules.projects.model.IProjectPhaseRepository;
import utez.edu.mx.back.modules.projects.model.ProjectPhase;
import utez.edu.mx.back.modules.tasks.model.ITaskRepository;
import utez.edu.mx.back.modules.tasks.model.Task;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class PhaseService {
    private final IPhasesRepository phasesRepository;
    private final ITaskRepository taskRepository;
    private final IProjectPhaseRepository projectPhaseRepository;

    // Obtener todas las fases
    @Transactional(readOnly = true)
    public ResponseEntity<Object> getAllPhases() {
        List<Phase> phases = phasesRepository.findAll();
        return new ResponseEntity<>(new ApiResponse<>(phases, TypesResponse.SUCCESS, "Lista de fases obtenida correctamente."), HttpStatus.OK);
    }

    // Obtener una fase por su tipo
    @Transactional(readOnly = true)
    public Optional<Phase> findByPhase(TypePhase phaseType) {
        return phasesRepository.findByPhase(phaseType);
    }

    /**
     * Verifica si todas las tareas de una fase específica de un proyecto están completadas
     * @param projectId ID del proyecto
     * @param phaseId ID de la fase
     * @return true si todas las tareas están completadas, false en caso contrario
     */
    @Transactional(readOnly = true)
    public boolean areAllTasksCompleted(Long projectId, Long phaseId) {
        List<Task> tasks = taskRepository.findByProjectIdAndPhaseId(projectId, phaseId);

        // Si no hay tareas, consideramos que la fase está incompleta
        if (tasks.isEmpty()) {
            return false;
        }

        // Verificar si todas las tareas están completadas
        return tasks.stream().allMatch(task -> task.getCompleted() != null && task.getCompleted());
    }

    /**
     * Avanza a la siguiente fase del proyecto si todas las tareas de la fase actual están completadas
     * @param projectId ID del proyecto
     * @param currentPhaseId ID de la fase actual
     * @return ResponseEntity con el resultado de la operación
     */
    @Transactional
    public ResponseEntity<Object> moveToNextPhase(Long projectId, Long currentPhaseId) {
        // Verificar si todas las tareas de la fase actual están completadas
        if (!areAllTasksCompleted(projectId, currentPhaseId)) {
            return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "No se puede avanzar a la siguiente fase porque hay tareas pendientes."), 
                HttpStatus.BAD_REQUEST
            );
        }

        // Obtener la fase actual
        Optional<Phase> currentPhaseOpt = phasesRepository.findById(currentPhaseId);
        if (currentPhaseOpt.isEmpty()) {
            return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "La fase actual no existe."), 
                HttpStatus.NOT_FOUND
            );
        }

        Phase currentPhase = currentPhaseOpt.get();
        TypePhase currentType = currentPhase.getPhase();

        // Determinar la siguiente fase
        TypePhase nextType;
        switch (currentType) {
            case INICIO:
                nextType = TypePhase.PLANEACIÓN;
                break;
            case PLANEACIÓN:
                nextType = TypePhase.EJECUCIÓN;
                break;
            case EJECUCIÓN:
                nextType = TypePhase.CONTROL;
                break;
            case CONTROL:
                nextType = TypePhase.CIERRE;
                break;
            case CIERRE:
                // Ya estamos en la última fase
                return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "El proyecto ya está en la fase final."), 
                    HttpStatus.BAD_REQUEST
                );
            default:
                return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Tipo de fase no reconocido."), 
                    HttpStatus.BAD_REQUEST
                );
        }

        // Buscar la siguiente fase
        Optional<Phase> nextPhaseOpt = phasesRepository.findByPhase(nextType);
        if (nextPhaseOpt.isEmpty()) {
            return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "La siguiente fase no está configurada en el sistema."), 
                HttpStatus.NOT_FOUND
            );
        }

        Phase nextPhase = nextPhaseOpt.get();

        // Marcar la fase actual como completada
        List<ProjectPhase> projectPhases = projectPhaseRepository.findByProjectId(projectId);
        ProjectPhase currentProjectPhase = null;

        for (ProjectPhase pp : projectPhases) {
            if (pp.getPhase().getId().equals(currentPhaseId)) {
                currentProjectPhase = pp;
                break;
            }
        }

        if (currentProjectPhase == null) {
            return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "La relación entre el proyecto y la fase actual no existe."), 
                HttpStatus.NOT_FOUND
            );
        }

        // Actualizar la fase actual como completada
        currentProjectPhase.setCompleted(true);
        currentProjectPhase.setEndDate(new Date());
        projectPhaseRepository.save(currentProjectPhase);

        // Verificar si la siguiente fase ya existe para este proyecto
        boolean nextPhaseExists = false;
        for (ProjectPhase pp : projectPhases) {
            if (pp.getPhase().getId().equals(nextPhase.getId())) {
                nextPhaseExists = true;
                break;
            }
        }

        // Si la siguiente fase no existe para este proyecto, crearla
        if (!nextPhaseExists) {
            ProjectPhase newProjectPhase = new ProjectPhase();
            newProjectPhase.setProject(currentProjectPhase.getProject());
            newProjectPhase.setPhase(nextPhase);
            newProjectPhase.setStartDate(new Date());
            newProjectPhase.setCompleted(false);
            projectPhaseRepository.save(newProjectPhase);
        }

        return new ResponseEntity<>(
            new ApiResponse<>(nextPhase, TypesResponse.SUCCESS, "Proyecto avanzado a la siguiente fase correctamente."), 
            HttpStatus.OK
        );
    }
}
