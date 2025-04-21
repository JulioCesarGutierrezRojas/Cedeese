import { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar.jsx";
import { useNavigate } from "react-router";
import { createTask, getProjects } from "../adapters/controllerRd.js"
import swal from "sweetalert2";

const TaskForm = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        name: "", // Cambiado de 'titulo' a 'name' para coincidir con tu modelo
        project_id: "",
        phase_id: "" // Se asignará automáticamente la primera fase
    });

    // Cargar proyectos al montar el componente
    useEffect(() => {
        const loadProjects = async () => {
            const result = await getProjects();
            if (result.success) {
                setProjects(result.projects);
            }
        };
        loadProjects();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Asignar automáticamente la primera fase (ID 1)
        const taskToCreate = {
            ...formData,
            phase_id: 1, // Fase inicial fija
            completed: false // Siempre false al crear
        };

        const result = await createTask(taskToCreate);

        if (result.success) {
            swal.fire({
                title: "Éxito",
                text: "Tarea creada correctamente",
                icon: "success"
            });
            navigate("/taskrd");
        } else {
            swal.fire({
                title: "Error",
                text: result.error || "Error al crear la tarea",
                icon: "error"
            });
        }
    };

    return (
        <div className="d-flex">
            <Sidebar role="RD" />
            <div className="container mt-4">
                <h2 className="mb-4">Crear nueva tarea</h2>
                <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nombre de la tarea</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="project_id" className="form-label">Proyecto</label>
                        <select
                            className="form-select"
                            id="project_id"
                            name="project_id"
                            value={formData.project_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccionar proyecto</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="alert alert-info">
                        <strong>Fase asignada automáticamente:</strong> Análisis (primera fase)
                    </div>

                    <button type="submit" className="btn btn-success">Guardar tarea</button>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;