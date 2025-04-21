import { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar.jsx";
import { Edit, Trash2, Plus, Check } from "react-feather";
import { useNavigate } from "react-router";

const TaskRd = () => {
    const navigate = useNavigate();
    const [tareas, setTareas] = useState([]);

    useEffect(() => {
        const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
        setTareas(tareasGuardadas);
    }, []);

    const eliminarTarea = (id) => {
        const nuevasTareas = tareas.filter(tarea => tarea.id !== id);
        setTareas(nuevasTareas);
        localStorage.setItem("tareas", JSON.stringify(nuevasTareas));
    };

    const completarTarea = (id) => {
        // Aquí puedes agregar la lógica para marcar la tarea como completada
        console.log(`Tarea ${id} completada`);
        // Por ejemplo, podrías actualizar el estado de la tarea
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

                <div className="d-flex flex-column gap-3">
                    {tareas.map(tarea => (
                        <div key={tarea.id} className="card p-3 shadow-sm">
                            <h5 className="mb-1">{tarea.titulo}</h5>
                            <p className="mb-1"><strong>Fase:</strong> {tarea.fase}</p>
                            <p className="mb-3"><strong>Estado:</strong> {tarea.estado}</p>
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
                                {tarea.fase === "Cierre" && (
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => completarTarea(tarea.id)}
                                    >
                                        <Check size={14} className="me-1" />
                                        Tarea completada
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskRd;