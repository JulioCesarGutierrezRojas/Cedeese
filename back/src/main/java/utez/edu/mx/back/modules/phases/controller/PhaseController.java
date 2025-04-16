package utez.edu.mx.back.modules.phases.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.modules.phases.model.Phase;
import utez.edu.mx.back.modules.phases.service.PhaseService;

import java.util.List;

@RestController
@RequestMapping("/api/phases")
@CrossOrigin(origins = "*")
public class PhaseController {
    @Autowired
    private PhaseService phaseService;


    @GetMapping
    public ApiResponse<List<Phase>> getAllPhases() {
        return phaseService.getAllPhases();
    }


    @GetMapping("/{id}")
    public ApiResponse<Phase> getPhaseById(@PathVariable Long id) {
        return phaseService.getPhaseById(id);
    }


    @PostMapping
    public ApiResponse<Phase> createPhase(@RequestBody Phase phase) {
        return phaseService.savePhase(phase);
    }


    @PutMapping("/{id}")
    public ApiResponse<Phase> updatePhase(@PathVariable Long id, @RequestBody Phase phase) {
        return phaseService.updatePhase(id, phase);
    }


    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePhase(@PathVariable Long id) {
        return phaseService.deletePhase(id);
    }
}
