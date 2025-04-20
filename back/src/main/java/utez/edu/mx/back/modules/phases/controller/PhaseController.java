package utez.edu.mx.back.modules.phases.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Fases", description = "Endpoints de API para la gestión de fases de proyectos")
public class PhaseController {
    private final PhaseService phaseService;

    @Operation(summary = "Obtener todas las fases", description = "Recupera una lista de todas las fases disponibles del proyecto")
    @GetMapping("/")
    public ResponseEntity<Object> getAllPhases() {
        return phaseService.getAllPhases();
    }

    /**
     * Avanza a la siguiente fase del proyecto si todas las tareas de la fase actual están completadas
     * @param dto Objeto con el ID del proyecto y el ID de la fase actual
     * @return ResponseEntity con el resultado de la operación
     */
    @Operation(summary = "Avanzar a la siguiente fase", description = "Avanza un proyecto a la siguiente fase si todas las tareas en la fase actual están completadas")
    @PostMapping("/next-phase")
    public ResponseEntity<Object> moveToNextPhase(@RequestBody MoveToNextPhaseDto dto) {
        return phaseService.moveToNextPhase(dto.getProjectId(), dto.getCurrentPhaseId());
    }
}
