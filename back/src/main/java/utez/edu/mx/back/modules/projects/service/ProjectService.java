package utez.edu.mx.back.modules.projects.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.back.kernel.ApiResponse;
import utez.edu.mx.back.kernel.TypesResponse;
import utez.edu.mx.back.modules.employees.model.Employee;
import utez.edu.mx.back.modules.employees.model.IEmployeeRepository;
import utez.edu.mx.back.modules.phases.model.Phase;
import utez.edu.mx.back.modules.phases.model.TypePhase;
import utez.edu.mx.back.modules.phases.service.PhaseService;
import utez.edu.mx.back.modules.projects.controller.dto.AssignEmployeesDto;
import utez.edu.mx.back.modules.projects.controller.dto.CreateProjectDto;
import utez.edu.mx.back.modules.projects.controller.dto.CompleteProjectDto;
import utez.edu.mx.back.modules.projects.controller.dto.GetProjectByEmployeeDto;
import utez.edu.mx.back.modules.projects.controller.dto.GetProjectsByRoleDto;
import utez.edu.mx.back.modules.projects.model.IProjectPhaseRepository;
import utez.edu.mx.back.modules.projects.model.IProjectRepository;
import utez.edu.mx.back.modules.projects.model.Project;
import utez.edu.mx.back.modules.projects.model.ProjectPhase;
import utez.edu.mx.back.modules.roles.model.TypeRol;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
@RequiredArgsConstructor
public class ProjectService {
    private final IProjectRepository repository;
    private final PhaseService phaseService;
    private final IEmployeeRepository employeeRepository;
    private final IProjectPhaseRepository projectPhaseRepository;

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> saveProject(CreateProjectDto dto) {
        // Validar que el nombre no se repita
        if (repository.existsByName(dto.getName())) {
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El nombre del proyecto ya existe"), HttpStatus.BAD_REQUEST);
        }

        // Validar que el identificador no se repita
        if (repository.existsByIdentifier(dto.getIdentifier())) {
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El identificador del proyecto ya existe"), HttpStatus.BAD_REQUEST);
        }

        // Validar que la duración no exceda 4 meses
        if (dto.getEndDate() != null) {
            long diffInMillies = dto.getEndDate().getTime() - dto.getStartDate().getTime();
            long diffInDays = TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);

            // Aproximadamente 4 meses = 120 días
            if (diffInDays > 120) {
                return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "La duración del proyecto no puede exceder los 4 meses"), HttpStatus.BAD_REQUEST);
            }
        }

        // Crear el proyecto
        Project project = new Project(dto.getName(), dto.getIdentifier(), dto.getStartDate(), dto.getEndDate(), false);

        // Guardar el proyecto
        Project savedProject = repository.save(project);

        // Asignar la fase inicial (INICIO) al proyecto
        Optional<Phase> initialPhaseOpt = phaseService.findByPhase(TypePhase.INICIO);
        if (initialPhaseOpt.isPresent()) {
            Phase initialPhase = initialPhaseOpt.get();

            // Crear la relación entre el proyecto y la fase
            ProjectPhase projectPhase = new ProjectPhase(savedProject, initialPhase, savedProject.getStartDate(), false);

            // Guardar la relación
            projectPhaseRepository.save(projectPhase);
        } else {
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "No se pudo asignar la fase inicial al proyecto"), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.SUCCESS, "Proyecto creado exitosamente"), HttpStatus.CREATED);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> completeProject(CompleteProjectDto dto) {
        // Buscar el proyecto por ID
        Optional<Project> optionalProject = repository.findById(dto.getId());
        if (optionalProject.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El proyecto no existe"), HttpStatus.NOT_FOUND);
        }

        Project project = optionalProject.get();

        // Verificar si el proyecto ya está completado
        if (project.getStatus()) {
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El proyecto ya está completado"), HttpStatus.BAD_REQUEST);
        }

        // Obtener todas las fases del proyecto
        List<ProjectPhase> projectPhases = projectPhaseRepository.findByProjectId(dto.getId());

        // Verificar si todas las fases están completadas
        for (ProjectPhase projectPhase : projectPhases) {
            if (!projectPhase.getCompleted()) {
                return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "No se puede completar el proyecto porque no todas las fases están completadas"), HttpStatus.BAD_REQUEST);
            }
        }

        // Si todas las fases están completadas, marcar el proyecto como completado
        project.setStatus(true);

        // Liberar a los empleados RD y AP asignados al proyecto
        if (project.getEmployees() != null && !project.getEmployees().isEmpty()) {
            // Crear una nueva lista para mantener solo los empleados RAPE
            List<Employee> employeesToKeep = new ArrayList<>();

            for (Employee employee : project.getEmployees()) {
                // Solo mantener los empleados RAPE, liberar RD y AP
                if (employee.getRol().getRol() == TypeRol.RAPE) {
                    employeesToKeep.add(employee);
                }
            }

            // Actualizar la lista de empleados del proyecto
            project.getEmployees().clear();
            project.getEmployees().addAll(employeesToKeep);
        }

        repository.save(project);

        return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.SUCCESS, "Proyecto completado exitosamente y empleados RD y AP liberados"), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> assignEmployeesToProject(AssignEmployeesDto dto) {
        // Buscar el proyecto por ID
        Optional<Project> optionalProject = repository.findById(dto.getProjectId());
        if (optionalProject.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El proyecto no existe"), HttpStatus.NOT_FOUND);
        }

        Project project = optionalProject.get();

        // Buscar el empleado RAPE
        Optional<Employee> optionalRape = employeeRepository.findById(dto.getRapeId());
        if (optionalRape.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El empleado RAPE no existe"), HttpStatus.NOT_FOUND);
        }

        Employee rapeEmployee = optionalRape.get();

        // Verificar que el empleado RAPE tenga el rol RAPE
        if (rapeEmployee.getRol().getRol() != TypeRol.RAPE) {
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El empleado seleccionado no tiene el rol RAPE"), HttpStatus.BAD_REQUEST);
        }

        // Buscar el empleado RD
        Optional<Employee> optionalRd = employeeRepository.findById(dto.getRdId());
        if (optionalRd.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El empleado RD no existe"), HttpStatus.NOT_FOUND);
        }

        Employee rdEmployee = optionalRd.get();

        // Verificar que el empleado RD tenga el rol RD
        if (rdEmployee.getRol().getRol() != TypeRol.RD) {
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El empleado seleccionado no tiene el rol RD"), HttpStatus.BAD_REQUEST);
        }

        // Verificar que el empleado RD no esté asignado a otro proyecto
        if (!rdEmployee.getProjects().isEmpty()) {
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El empleado RD ya está asignado a otro proyecto"), HttpStatus.BAD_REQUEST);
        }

        // Lista para almacenar los empleados AP
        List<Employee> apEmployees = new ArrayList<>();

        // Verificar y agregar cada empleado AP
        for (Long apId : dto.getApIds()) {
            Optional<Employee> optionalAp = employeeRepository.findById(apId);
            if (optionalAp.isEmpty()) {
                return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El empleado AP con ID " + apId + " no existe"), HttpStatus.NOT_FOUND);
            }

            Employee apEmployee = optionalAp.get();

            // Verificar que el empleado AP tenga el rol AP
            if (apEmployee.getRol().getRol() != TypeRol.AP) {
                return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El empleado con ID " + apId + " no tiene el rol AP"), HttpStatus.BAD_REQUEST);
            }

            // Verificar que el empleado AP no esté asignado a otro proyecto
            if (!apEmployee.getProjects().isEmpty()) {
                return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El empleado AP con ID " + apId + " ya está asignado a otro proyecto"), HttpStatus.BAD_REQUEST);
            }

            apEmployees.add(apEmployee);
        }

        // Limpiar la lista de empleados actual del proyecto
        if (project.getEmployees() == null) {
            project.setEmployees(new ArrayList<>());
        } else {
            project.getEmployees().clear();
        }

        // Asignar los empleados al proyecto explícitamente usando la tabla project_has_employees
        // Agregar el empleado RAPE
        project.getEmployees().add(rapeEmployee);

        // Agregar el empleado RD
        project.getEmployees().add(rdEmployee);

        // Agregar los empleados AP
        for (Employee apEmployee : apEmployees) {
            project.getEmployees().add(apEmployee);
        }

        // Guardar el proyecto actualizado para persistir las relaciones en project_has_employees
        repository.save(project);

        return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.SUCCESS, "Empleados asignados al proyecto exitosamente"), HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getAllProjects(GetProjectsByRoleDto dto) {
        // Buscar el empleado por ID
        Optional<Employee> optionalEmployee = employeeRepository.findById(dto.getEmployeeId());
        if (optionalEmployee.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El empleado no existe"), HttpStatus.NOT_FOUND);
        }

        Employee employee = optionalEmployee.get();

        // Verificar el rol del empleado
        TypeRol employeeRole = employee.getRol().getRol();

        // Si el rol es MASTER, devolver todos los proyectos
        if (employeeRole == TypeRol.MASTER) {
            List<Project> projects = repository.findAll();
            return new ResponseEntity<>(new ApiResponse<>(projects, TypesResponse.SUCCESS, "Lista de todos los proyectos"), HttpStatus.OK);
        }

        // Si el rol es RAPE, devolver los proyectos donde está asignado
        if (employeeRole == TypeRol.RAPE) {
            List<Project> projects = repository.findByEmployeeId(dto.getEmployeeId());
            return new ResponseEntity<>(new ApiResponse<>(projects, TypesResponse.SUCCESS, "Lista de proyectos del RAPE"), HttpStatus.OK);
        }

        // Si el rol no es MASTER ni RAPE, devolver un error
        return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El empleado no tiene permisos para ver todos los proyectos"), HttpStatus.FORBIDDEN);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getProjectByEmployee(GetProjectByEmployeeDto dto) {
        // Buscar el empleado por ID
        Optional<Employee> optionalEmployee = employeeRepository.findById(dto.getEmployeeId());
        if (optionalEmployee.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El empleado no existe"), HttpStatus.NOT_FOUND);
        }

        Employee employee = optionalEmployee.get();

        // Verificar el rol del empleado
        TypeRol employeeRole = employee.getRol().getRol();

        // Solo RD y AP pueden usar esta función
        if (employeeRole != TypeRol.RD && employeeRole != TypeRol.AP) {
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "Solo los empleados RD y AP pueden usar esta función"), HttpStatus.FORBIDDEN);
        }

        // Obtener los proyectos del empleado
        List<Project> projects = repository.findByEmployeeId(dto.getEmployeeId());

        // RD y AP solo deberían estar asignados a un proyecto
        if (projects.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse<>(TypesResponse.ERROR, "El empleado no está asignado a ningún proyecto"), HttpStatus.NOT_FOUND);
        }

        // Devolver el proyecto
        return new ResponseEntity<>(new ApiResponse<>(projects.get(0), TypesResponse.SUCCESS, "Proyecto del empleado"), HttpStatus.OK);
    }
}
