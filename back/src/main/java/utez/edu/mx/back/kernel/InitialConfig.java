package utez.edu.mx.back.kernel;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import utez.edu.mx.back.modules.employees.model.Employee;
import utez.edu.mx.back.modules.employees.model.IEmployeeRepository;
import utez.edu.mx.back.modules.phases.model.IPhasesRepository;
import utez.edu.mx.back.modules.phases.model.Phase;
import utez.edu.mx.back.modules.phases.model.TypePhase;
import utez.edu.mx.back.modules.roles.model.IRolRepository;
import utez.edu.mx.back.modules.roles.model.Rol;
import utez.edu.mx.back.modules.roles.model.TypeRol;

@Configuration
@RequiredArgsConstructor
public class InitialConfig implements CommandLineRunner {
    private final IRolRepository rolRepository;
    private final IPhasesRepository  phaseRepository;
    private final IEmployeeRepository employeeRepository;
    private final Logger logger = LoggerFactory.getLogger(InitialConfig.class.getName());
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Creación de los Roles
        for (TypeRol typeRol : TypeRol.values()) {
            try {
                if (!rolRepository.existsByRol(typeRol)) {
                    Rol rol = new Rol();
                    rol.setRol(typeRol);
                    rolRepository.save(rol);
                    logger.info("Rol {} creado correctamente", typeRol);
                } else {
                    logger.info("El Rol {} ya existe", typeRol);
                }
            } catch (Exception e) {
                logger.error("Error al crear el rol {}: {}", typeRol, e.getMessage());
            }
        }

        // Creación de las Fases
        for (TypePhase typePhase : TypePhase.values()) {
            try {
                if (!phaseRepository.existsByPhase(typePhase)) {
                    Phase phase = new Phase();
                    phase.setPhase(typePhase);
                    phaseRepository.save(phase);
                    logger.info("Fase {} creada correctamente", typePhase);
                } else {
                    logger.info("La Fase {} ya existe", typePhase);
                }
            } catch (Exception e) {
                logger.error("Error al crear la fase {}: {}", typePhase, e.getMessage());
            }
        }

        // Creación del Usuario MASTER
        String masterEmail = "master@utez.edu.mx";
        try {
            if (!employeeRepository.existsByEmail(masterEmail)) {
                Rol masterRole = rolRepository.findByRol(TypeRol.MASTER).orElseThrow(() -> new RuntimeException("Rol MASTER no encontrado"));

                Employee master = new Employee();
                master.setUsername("Master");
                master.setPassword(passwordEncoder.encode("master"));
                master.setName("Administrador");
                master.setLastname("Master");
                master.setEmail(masterEmail);
                master.setRol(masterRole);
                master.setStatus(true);

                employeeRepository.save(master);
                logger.info("Usuario MASTER creado correctamente");
            } else {
                logger.info("Usuario MASTER ya existe");
            }
        } catch (Exception e) {
            logger.error("Error al crear usuario MASTER: {}", e.getMessage());
        }
    }
}
