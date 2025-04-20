import { useState } from "react";
import Sidebar from "../../../components/Sidebar.jsx";
import { useNavigate } from "react-router";

const TaskForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        titulo: "",
        fase: "",
        estado: "Pendiente"
    });

    const handleGuardar = () => {
        const nuevasTareas = JSON.parse(localStorage.getItem("tareas")) || [];
        nuevasTareas.push({
            id: Date.now(), // o un ID único
            titulo,
            fase,
            estado: "Pendiente",
        });
        localStorage.setItem("tareas", JSON.stringify(nuevasTareas));
        navigate("/taskrd");
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const nuevasTareas = JSON.parse(localStorage.getItem("tareas")) || [];

        nuevasTareas.push({
            id: Date.now(),
            titulo: formData.titulo,
            fase: formData.fase,
            estado: formData.estado,
        });

        localStorage.setItem("tareas", JSON.stringify(nuevasTareas));
        console.log("Tarea creada:", formData);

        navigate("/rd");
    };


    return (
        <div className="d-flex">
            <Sidebar role="RD" />
            <div className="container mt-4">
                <h2 className="mb-4">Crear nueva tarea</h2>
                <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                    <div className="mb-3">
                        <label htmlFor="titulo" className="form-label">Título de la tarea</label>
                        <input
                            type="text"
                            className="form-control"
                            id="titulo"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="fase" className="form-label">Fase</label>
                        <select
                            className="form-select"
                            id="fase"
                            name="fase"
                            value={formData.fase}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccionar fase</option>
                            <option value="Análisis">Análisis</option>
                            <option value="Diseño">Diseño</option>
                            <option value="Desarrollo">Desarrollo</option>
                            <option value="Testing">Testing</option>
                            <option value="Despliegue">Despliegue</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="estado" className="form-label">Estado</label>
                        <select
                            className="form-select"
                            id="estado"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Proceso">En Proceso</option>
                            <option value="Completada">Completada</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-success">Guardar tarea</button>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
