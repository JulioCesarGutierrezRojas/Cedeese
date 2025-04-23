import { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar.jsx";
import { useNavigate } from "react-router";
import { createTask, getProjectsByCurrentEmployee } from "../adapters/controllerRd.js";
import swal from "sweetalert2";

const TaskForm = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        projectId: "",
        currentPhase: { id: 1, phase: "INICIO" } // Estado para la fase actual
    });

    // Cargar proyectos del empleado al montar el componente
    useEffect(() => {
        const loadProjects = async () => {
            setLoading(true);
            try {
                // Obtener ID del usuario desde localStorage
                const userId = localStorage.getItem('id');
                const userToken = localStorage.getItem('token');

                console.log('Verificando autenticación:', { userId, userToken });

                if (!userId || !userToken) {
                    throw new Error('Usuario no autenticado');
                }

                console.log('Obteniendo proyectos para usuario ID:', userId);
                const result = await getProjectsByCurrentEmployee(userId);

                if (result.success) {
                    console.log('Proyectos recibidos:', result.projects);
                    setProjects(result.projects);
                } else {
                    throw new Error(result.message || 'Error al obtener proyectos');
                }
            } catch (error) {
                console.error("Error al cargar proyectos:", error);
                swal.fire({
                    title: "Error",
                    text: error.message,
                    icon: "error"
                }).then(() => {
                    // Redirigir a login si no está autenticado
                    if (error.message.includes('autenticado')) {
                        navigate('/login');
                    }
                });
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "projectId") {
            // Cuando cambia el proyecto, actualiza la fase actual
            const selectedProject = projects.find(p => p.id == value);
            setFormData(prev => ({
                ...prev,
                [name]: value,
                currentPhase: selectedProject?.currentPhase || { id: 1, phase: "INICIO" }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validaciones mejoradas
            if (!formData.name.trim()) {
                throw new Error("El nombre de la tarea no puede estar vacío");
            }

            if (!formData.projectId || isNaN(formData.projectId)) {
                throw new Error("Debes seleccionar un proyecto válido");
            }

            console.log('[DEBUG] Enviando datos para crear tarea:', formData);

            // Crear la tarea con manejo de errores mejorado
            const result = await createTask({
                name: formData.name.trim(),
                projectId: formData.projectId,
                currentPhase: formData.currentPhase // Incluimos la fase actual
            });

            if (!result) {
                throw new Error("No se recibió respuesta del servidor");
            }

            if (result.success) {
                swal.fire({
                    title: "Éxito",
                    text: "Tarea creada correctamente",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    navigate("/rd");
                });
            } else {
                throw new Error(result.error || "Error al crear la tarea");
            }
        } catch (error) {
            console.error("Error detallado al crear tarea:", {
                error: error,
                formData: formData,
                time: new Date().toISOString()
            });

            let errorMessage = error.message;

            // Manejo específico de errores conocidos
            if (error.message.includes('projectId')) {
                errorMessage = "El proyecto seleccionado no es válido";
            } else if (error.message.includes('name')) {
                errorMessage = "El nombre de la tarea es requerido";
            }

            swal.fire({
                title: "Error",
                html: `
                    <div>
                        <p>${errorMessage}</p>
                        <details style="margin-top: 10px; color: #666; font-size: 0.8em;">
                            <summary>Detalles técnicos</summary>
                            <p>${error.message}</p>
                        </details>
                    </div>
                `,
                icon: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex">
            <Sidebar role="RD" />
            <div className="container mt-4">
                <h2 className="mb-4">Crear nueva tarea</h2>

                <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                    {/* Campo Nombre de la Tarea */}
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Nombre de la tarea *
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="Ingrese el nombre de la tarea"
                        />
                    </div>

                    {/* Selector de Proyecto */}
                    <div className="mb-3">
                        <label htmlFor="projectId" className="form-label">
                            Proyecto *
                        </label>
                        <select
                            className={`form-select ${!formData.projectId ? "text-muted" : ""}`}
                            id="projectId"
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleChange}
                            required
                            disabled={loading || projects.length === 0}
                        >
                            <option value="">{projects.length === 0 ? "No hay proyectos disponibles" : "Seleccione un proyecto"}</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name} {project.identifier ? `(${project.identifier})` : ''}
                                </option>
                            ))}
                        </select>

                        {/* Mensajes de estado */}
                        {loading && projects.length === 0 && (
                            <div className="mt-2 text-info">
                                <small>Cargando proyectos...</small>
                            </div>
                        )}
                        {!loading && projects.length === 0 && (
                            <div className="mt-2 text-warning">
                                <small>No tienes proyectos asignados</small>
                            </div>
                        )}
                    </div>

                    {/* Información de Fase Actual */}
                    <div className="mb-3 alert alert-info">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <label className="form-label mb-0">Fase actual del proyecto:</label>
                                <div>
                                    <strong>{formData.currentPhase.phase}</strong>
                                </div>
                            </div>
                            <small className="text-muted">
                                {formData.currentPhase.id === 1
                                    ? "(Nuevas tareas comienzan en fase INICIO)"
                                    : "(La tarea se creará en la fase actual del proyecto)"}
                            </small>
                        </div>
                    </div>

                    {/* Botón de Envío */}
                    <div className="d-flex justify-content-end">
                        <button
                            type="button"
                            className="btn btn-outline-secondary me-2"
                            onClick={() => navigate("/rd")}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={loading || projects.length === 0}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Creando...
                                </>
                            ) : "Guardar tarea"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;