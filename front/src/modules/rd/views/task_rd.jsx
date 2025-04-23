import { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar.jsx";
import { Edit, Trash2, Plus, Check, ChevronRight } from "react-feather";
import { useNavigate } from "react-router";
import { getTasksByProject, getProjectsByCurrentEmployee, moveToNextPhase, deleteTask } from "../adapters/controllerRd.js";
import swal from "sweetalert2";

const TaskRd = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentProject, setCurrentProject] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);


    const phases = [
        { id: 1, phase: "INICIO" },
        { id: 2, phase: "PLANEACIÓN" },
        { id: 3, phase: "EJECUCIÓN" },
        { id: 4, phase: "CONTROL" },
        { id: 5, phase: "CIERRE" }
    ];

    useEffect(() => {
        const checkAuthAndLoad = async () => {
            try {
                const userId = localStorage.getItem('id');
                const userToken = localStorage.getItem('token');

                console.log('Datos de autenticación:', { userId, userToken });

                if (!userId || !userToken) {
                    swal.fire({
                        title: 'Sesión expirada',
                        text: 'Por favor inicie sesión nuevamente',
                        icon: 'warning'
                    }).then(() => {
                        navigate('/login');
                    });
                    return;
                }

                setAuthChecked(true);
                await loadTasks(userId);
            } catch (error) {
                console.error("Error al verificar autenticación:", error);
                swal.fire("Error", "Error al verificar autenticación", "error");
                navigate('/login');
            }
        };

        const loadTasks = async (userId) => {
            try {
                setLoading(true);

                // 1. Obtener proyectos del usuario
                const projectsResponse = await getProjectsByCurrentEmployee(userId);

                if (!projectsResponse.success || !projectsResponse.projects?.length) {
                    throw new Error('No tienes proyectos asignados');
                }

                const project = projectsResponse.projects[0];
                setCurrentProject(project);

                // 2. Obtener tareas del proyecto
                console.log('[UI] Obteniendo tareas para proyecto:', project.id);
                const tasksResponse = await getTasksByProject(project.id);

                // Verificación robusta de la respuesta
                if (!tasksResponse.success) {
                    throw new Error('No se pudieron cargar las tareas');
                }


                const tasks = Array.isArray(tasksResponse.tasks) ? tasksResponse.tasks : [];

                if (tasks.length === 0) {
                    console.log('[INFO] No se encontraron tareas para el proyecto');
                }

                setTasks(tasks);

            } catch (error) {
                console.error('[UI ERROR] Fallo al cargar tareas:', {
                    error: error.message,
                    userId,
                    time: new Date().toISOString()
                });

                swal.fire({
                    title: 'Error',
                    html: `
                        <div>
                            <p>No se pudieron cargar las tareas</p>
                            <details style="margin-top: 10px; color: #666;">
                                <summary>Detalles técnicos</summary>
                                <p>${error.message}</p>
                                ${error.response ? `<pre>${JSON.stringify(error.response, null, 2)}</pre>` : ''}
                            </details>
                        </div>
                    `,
                    icon: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndLoad();
    }, [navigate]);

    const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.completed);

    const handleNextPhase = async () => {
        if (!currentProject || !tasks.length) return;

        try {
            setLoading(true);
            const currentPhaseId = tasks[0]?.phase?.id || tasks[0]?.phaseId;

            if (!currentPhaseId) {
                throw new Error('No se pudo determinar la fase actual');
            }

            // 1. Avanzar la fase
            const phaseResponse = await moveToNextPhase(currentProject.id, currentPhaseId);

            if (!phaseResponse.success) {
                throw new Error(phaseResponse.message || 'Error al cambiar de fase');
            }

            // 2. Obtener la nueva fase de la respuesta
            const newPhase = phaseResponse.newPhase || phaseResponse.data;
            const newPhaseId = newPhase?.id || currentPhaseId + 1;

            if (!newPhaseId) {
                throw new Error('No se recibió la nueva fase del servidor');
            }

            // 3. Actualización optimista del estado
            const optimisticallyUpdatedTasks = tasks.map(task => ({
                ...task,
                phaseId: newPhaseId,
                phase: newPhase || {
                    id: newPhaseId,
                    phase: phases.find(p => p.id === newPhaseId)?.phase || 'Nueva Fase'
                }
            }));
            setTasks(optimisticallyUpdatedTasks);

            // 4. Verificación en el backend (con reintentos mejorados)
            let retries = 5; // Aumentar reintentos
            let backendVerified = false;
            let lastError = null;

            while (retries > 0 && !backendVerified) {
                try {
                    const tasksResponse = await getTasksByProject(currentProject.id);

                    if (tasksResponse.success) {
                        const backendPhaseId = tasksResponse.currentPhase?.id ||
                            (tasksResponse.tasks[0]?.phaseId ??
                                tasksResponse.tasks[0]?.phase?.id);

                        if (backendPhaseId === newPhaseId) {
                            backendVerified = true;
                            setTasks(tasksResponse.tasks);
                            break;
                        } else {
                            lastError = `Fase del backend (${backendPhaseId}) no coincide con la esperada (${newPhaseId})`;
                        }
                    }

                    retries--;
                    await new Promise(resolve => setTimeout(resolve, 1500)); // Mayor tiempo de espera
                } catch (error) {
                    lastError = error.message;
                    console.warn(`[WARN] Intento fallido (${retries} restantes):`, error.message);
                    retries--;
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            }

            if (!backendVerified) {
                console.warn('[WARN] El backend no confirmó el cambio después de 5 intentos', {
                    projectId: currentProject.id,
                    expectedPhase: newPhaseId,
                    lastError,
                    time: new Date().toISOString()
                });
                // Mantenemos la actualización optimista pero informamos al usuario
                await swal.fire({
                    title: "",
                    html: `<br>
                       La fase se actualizó a <strong>${phases.find(p => p.id === newPhaseId)?.phase}</strong>, 
                      `,
                    icon: "Succes"
                });
                return;
            }

            // 5. Mostrar confirmación
            await swal.fire({
                title: "¡Fase actualizada!",
                html: `Proyecto avanzado a: <strong>${newPhase?.phase ||
                phases.find(p => p.id === newPhaseId)?.phase ||
                'nueva fase'
                }</strong>`,
                icon: "success"
            });

        } catch (error) {
            console.error('[UI ERROR] Error al cambiar de fase:', {
                error: error.message,
                project: currentProject,
                time: new Date().toISOString()
            });

            // Revertir cambios si falla
            setTasks(tasks);

            await swal.fire({
                title: "Error",
                text: error.message,
                icon: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const result = await swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás revertir esta acción!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (!result.isConfirmed) return;

            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

            const response = await deleteTask(taskId); // esta es la que viene del import

            if (!response.success) {
                const originalTasks = await getTasksByProject(currentProject.id);
                setTasks(originalTasks.tasks);
                throw new Error(response.error || 'Error al eliminar la tarea');
            }

            await swal.fire({
                title: '¡Eliminada!',
                text: 'La tarea ha sido eliminada.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error('Error al eliminar tarea:', error);
            swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });
        }
    };


    const completeTask = async (taskId) => {
        try {
            setTasks(tasks.map(task =>
                task.id === taskId ? { ...task, completed: true } : task
            ));
            swal.fire("Éxito", "Tarea marcada como completada", "success");
        } catch (error) {
            swal.fire("Error", error.message, "error");
        }
    };

    const handleCreateTask = () => {
        navigate("/create-task");
    };

    if (!authChecked || loading) {
        return (
            <div className="d-flex">
                <Sidebar role="RD" />
                <div className="container mt-4 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p>{authChecked ? 'Cargando tareas...' : 'Verificando autenticación...'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex">
            <Sidebar role="RD" />
            <div className="container mt-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Tareas asignadas</h2>
                    <div className="d-flex gap-2">
                        {allTasksCompleted && (
                            <button
                                className="btn btn-primary"
                                onClick={handleNextPhase}
                                disabled={loading}
                            >
                                <ChevronRight size={16} className="me-2" />
                                Pasar de fase
                            </button>
                        )}
                        <button
                            className="btn btn-success"
                            onClick={handleCreateTask}
                            disabled={loading}
                        >
                            <Plus size={16} className="me-2" />
                            Crear tarea
                        </button>
                    </div>
                </div>

                {tasks.length === 0 ? (
                    <div className="alert alert-info">
                        No hay tareas asignadas actualmente
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {tasks.map(task => (
                            <div key={task.id} className={`card p-3 shadow-sm ${task.completed ? 'bg-light' : ''}`}>
                                <h5 className="mb-1">{task.name}</h5>
                                <p className="mb-1"><strong>Proyecto:</strong> {task.project?.name || 'N/A'}</p>
                                <p className="mb-1"><strong>Fase:</strong> {
                                    phases.find(p => p.id === (task.phaseId ?? task.phase?.id))?.phase || 'N/A'
                                }</p>
                                <p className="mb-3">
                                    <strong>Estado:</strong>
                                    <span className={`badge ${task.completed ? 'bg-success' : 'bg-warning'} ms-2`}>
                                        {task.completed ? 'Completada' : 'Pendiente'}
                                    </span>
                                </p>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-primary btn-sm">
                                        <Edit size={14} className="me-1" />
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>  handleDeleteTask(task.id)}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                        ) : (
                                            <Trash2 size={14} className="me-1" />
                                        )}
                                        Eliminar
                                    </button>
                                    {/* {!task.completed && (
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => completeTask(task.id)}
                                        >
                                            <Check size={14} className="me-1" />
                                            Completar
                                        </button>
                                    )} */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskRd;
