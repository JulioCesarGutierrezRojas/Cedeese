package utez.edu.mx.back.modules.phases.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.modules.phases.controller.dto.MoveToNextPhaseDto;
import utez.edu.mx.back.modules.phases.model.Phase;
import utez.edu.mx.back.modules.phases.service.PhaseService;

import java.util.List;

@RestController
@RequestMapping("/api/phases")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PhaseController {
    private final PhaseService phaseService;

    @GetMapping("/")
    public ResponseEntity<Object> getAllPhases() {
        return phaseService.getAllPhases();
    }

    /**
     * Avanza a la siguiente fase del proyecto si todas las tareas de la fase actual están completadas
     * @param dto Objeto con el ID del proyecto y el ID de la fase actual
     * @return ResponseEntity con el resultado de la operación
     */
    @PostMapping("/next-phase")
    public ResponseEntity<Object> moveToNextPhase(@RequestBody MoveToNextPhaseDto dto) {
        return phaseService.moveToNextPhase(dto.getProjectId(), dto.getCurrentPhaseId());
    }
}
