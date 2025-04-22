import { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar.jsx";
import { Edit, Trash2, Plus, Check, ChevronRight } from "react-feather";
import { useNavigate } from "react-router";
import { getTasksByProject, getProjectsByCurrentEmployee, moveToNextPhase } from "../adapters/controllerRd.js";
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

            // Verificar que todas las tareas estén completadas
            if (!allTasksCompleted) {
                throw new Error('Todas las tareas deben estar completadas para avanzar de fase');
            }

            // Obtener la fase actual (asumiendo que todas las tareas están en la misma fase)
            const currentPhaseId = tasks[0].phase?.id || tasks[0].phaseId;

            if (!currentPhaseId) {
                throw new Error('No se pudo determinar la fase actual');
            }

            console.log('[UI] Avanzando fase:', {
                projectId: currentProject.id,
                currentPhaseId
            });

            const response = await moveToNextPhase(currentProject.id, currentPhaseId);

            if (response.success) {
                swal.fire({
                    title: "¡Éxito!",
                    text: response.message || `Proyecto avanzado a fase: ${phases.find(p => p.id === response.newPhase?.id)?.phase ||
                        response.newPhase?.id ||
                        'nueva fase'
                        }`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });

                // Recargar tareas después del cambio de fase
                const tasksResponse = await getTasksByProject(currentProject.id);
                if (tasksResponse.success) {
                    setTasks(tasksResponse.tasks);
                }
            }
        } catch (error) {
            console.error('[UI ERROR] Fallo al cambiar de fase:', {
                error: error.message,
                projectId: currentProject?.id,
                time: new Date().toISOString()
            });

            swal.fire({
                title: "Error",
                html: `
                    <div>
                        <p>${error.message}</p>
                        ${error.response?.data?.message ? `
                        <p class="small text-muted mt-2">
                            ${error.response.data.message}
                        </p>
                        ` : ''}
                    </div>
                `,
                icon: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            setTasks(tasks.filter(task => task.id !== taskId));
            swal.fire("Éxito", "Tarea eliminada correctamente", "success");
        } catch (error) {
            swal.fire("Error", error.message, "error");
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
        navigate("/taskform");
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
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        <Trash2 size={14} className="me-1" />
                                        Eliminar
                                    </button>
                                    {!task.completed && (
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => completeTask(task.id)}
                                        >
                                            <Check size={14} className="me-1" />
                                            Completar
                                        </button>
                                    )}
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