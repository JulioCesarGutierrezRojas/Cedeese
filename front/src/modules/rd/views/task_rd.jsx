import { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar.jsx";
import { Edit, Trash2, Plus, Check } from "react-feather";
import { useNavigate } from "react-router";
import { getTasks, deleteTask, updateTaskStatus } from "../adapters/controllerRd.js";
import swal from "sweetalert2";

const TaskRd = () => {
    const navigate = useNavigate();
    const [tareas, setTareas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true);
            try {
                const result = await getTasks();
                if (result.success) {
                    setTareas(result.tasks);
                } else {
                    swal.fire({
                        title: "Error",
                        text: "No se pudieron cargar las tareas",
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error("Error al cargar tareas:", error);
                swal.fire({
                    title: "Error",
                    text: "Error al cargar las tareas",
                    icon: "error"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const eliminarTarea = async (id) => {
        try {
            const result = await deleteTask(id);
            if (result.success) {
                // Actualizar el estado local después de eliminar en el servidor
                const nuevasTareas = tareas.filter(tarea => tarea.id !== id);
                setTareas(nuevasTareas);

                swal.fire({
                    title: "Éxito",
                    text: "Tarea eliminada correctamente",
                    icon: "success"
                });
            } else {
                swal.fire({
                    title: "Error",
                    text: result.error || "No se pudo eliminar la tarea",
                    icon: "error"
                });
            }
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
            swal.fire({
                title: "Error",
                text: "Error al eliminar la tarea",
                icon: "error"
            });
        }
    };

    const completarTarea = async (id) => {
        try {
            const result = await updateTaskStatus(id, true);
            if (result.success) {
                // Actualizar el estado local después de actualizar en el servidor
                const nuevasTareas = tareas.map(tarea => 
                    tarea.id === id ? { ...tarea, completed: true } : tarea
                );
                setTareas(nuevasTareas);

                swal.fire({
                    title: "Éxito",
                    text: "Tarea completada correctamente",
                    icon: "success"
                });
            } else {
                swal.fire({
                    title: "Error",
                    text: result.error || "No se pudo completar la tarea",
                    icon: "error"
                });
            }
        } catch (error) {
            console.error("Error al completar tarea:", error);
            swal.fire({
                title: "Error",
                text: "Error al completar la tarea",
                icon: "error"
            });
        }
    };

    const handleCreateTask = () => {
        navigate("/taskform");
    };

    return (
        <div className="d-flex">
            <Sidebar role="RD" />
            <div className="container mt-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Tareas asignadas</h2>
                    <button className="btn btn-success" onClick={handleCreateTask}>
                        <Plus size={16} className="me-2" />
                        Crear tarea
                    </button>
                </div>

                {isLoading ? (
                    <div className="d-flex justify-content-center my-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {tareas.length > 0 ? (
                            tareas.map(tarea => (
                                <div key={tarea.id} className="card p-3 shadow-sm">
                                    <h5 className="mb-1">{tarea.name || tarea.titulo}</h5>
                                    <p className="mb-1"><strong>Fase:</strong> {tarea.phase_name || tarea.fase || "No especificada"}</p>
                                    <p className="mb-3"><strong>Estado:</strong> {tarea.completed ? "Completada" : "Pendiente"}</p>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-primary btn-sm">
                                            <Edit size={14} className="me-1" />
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => eliminarTarea(tarea.id)}
                                        >
                                            <Trash2 size={14} className="me-1" />
                                            Eliminar
                                        </button>
                                        {!tarea.completed && (
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => completarTarea(tarea.id)}
                                            >
                                                <Check size={14} className="me-1" />
                                                Marcar como completada
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-info text-center">
                                No hay tareas disponibles. ¡Crea una nueva tarea!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskRd;
