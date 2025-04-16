package utez.edu.mx.back.modules.phases.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.kernel.TypesResponse;
import utez.edu.mx.back.modules.phases.model.IPhasesRepository;
import utez.edu.mx.back.modules.phases.model.Phase;
import utez.edu.mx.back.modules.phases.model.TypePhase;

import java.util.List;
import java.util.Optional;

@Service
public class PhaseService {

    @Autowired
    private IPhasesRepository phasesRepository;

    // Obtener todas las fases
    public ApiResponse<List<Phase>> getAllPhases() {
        List<Phase> phases = phasesRepository.findAll();
        return new ApiResponse<>(phases, TypesResponse.SUCCESS, "Lista de fases obtenida correctamente.");
    }

    // Obtener una fase por ID
    public ApiResponse<Phase> getPhaseById(Long id) {
        Optional<Phase> phase = phasesRepository.findById(id);
        return phase.map(value -> new ApiResponse<>(value, TypesResponse.SUCCESS, "Fase encontrada"))
                .orElseGet(() -> new ApiResponse<>(TypesResponse.ERROR, "Fase no encontrada"));
    }

    // Obtener una fase por nombre de fase
    public ApiResponse<Phase> getPhaseByName(TypePhase phaseName) {
        Optional<Phase> phase = phasesRepository.findByPhase(phaseName);
        return phase.map(value -> new ApiResponse<>(value, TypesResponse.SUCCESS, "Fase encontrada"))
                .orElseGet(() -> new ApiResponse<>(TypesResponse.ERROR, "Fase no encontrada"));
    }

    // Guardar una nueva fase
    public ApiResponse<Phase> savePhase(Phase phase) {
        if (phasesRepository.existsByPhase(phase.getPhase())) {
            return new ApiResponse<>(TypesResponse.ERROR, "La fase ya existe");
        }
        Phase savedPhase = phasesRepository.save(phase);
        return new ApiResponse<>(savedPhase, TypesResponse.SUCCESS, "Fase registrada correctamente");
    }

    // Actualizar una fase
    public ApiResponse<Phase> updatePhase(Long id, Phase phase) {
        if (!phasesRepository.existsById(id)) {
            return new ApiResponse<>(TypesResponse.ERROR, "Fase no encontrada");
        }
        phase.setId(id);
        Phase updatedPhase = phasesRepository.save(phase);
        return new ApiResponse<>(updatedPhase, TypesResponse.SUCCESS, "Fase actualizada correctamente");
    }

    // Eliminar una fase
    public ApiResponse<Void> deletePhase(Long id) {
        if (!phasesRepository.existsById(id)) {
            return new ApiResponse<>(TypesResponse.ERROR, "Fase no encontrada");
        }
        phasesRepository.deleteById(id);
        return new ApiResponse<>(TypesResponse.SUCCESS, "Fase eliminada exitosamente");
    }
}
