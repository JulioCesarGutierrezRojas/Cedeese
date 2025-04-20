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

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class PhaseService {
    private final IPhasesRepository phasesRepository;

    // Obtener todas las fases
    @Transactional
    public ResponseEntity<Object> getAllPhases() {
        List<Phase> phases = phasesRepository.findAll();
        return new ResponseEntity<>(new ApiResponse<>(phases, TypesResponse.SUCCESS, "Lista de fases obtenida correctamente."), HttpStatus.OK);
    }

    // Obtener una fase por su tipo
    @Transactional
    public Optional<Phase> findByPhase(TypePhase phaseType) {
        return phasesRepository.findByPhase(phaseType);
    }
}
