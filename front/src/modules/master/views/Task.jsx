import { useState, useEffect } from 'react';
import { getAllTask , createTask } from '../controller/controllerTask'; // ajusta la ruta si es necesario
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { data } from 'react-router';

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ name: '', phase_id: '', project_id: '', completed: '' });
    const itemsPerPage = 3;

    useEffect(() => {
        const fetchTask = async () => {
            setIsLoading(true);
            try {
                const response = await getAllTask();
                console.log('response', response);
                console.log(response.data);
                if (response && response.data) {
                    setTasks(response.data);
                }
            } catch (error) {
                showWarningToast({
                    title: 'Error al cargar las tareas',
                    text: error?.message || 'Error desconocido al cargar las tareas'
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchTask();
    }, []);

    useEffect(() => {
        console.log('✅ tasks actualizado:', tasks);
    }, [tasks]);
    

    const filteredTasks = tasks.filter(task =>
        (task.title?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (task.fase?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    );
    

    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleAddTask = async () => {
        if (newTask.title && newTask.fase) {
            
            const createdTask = await createTask(newTask);
    
            if (createdTask) {
                const updatedTasks = await getAllTask(); // actualiza desde el backend
                setTasks(updatedTasks);
                setNewTask({ title: '', fase: '', status: 'Activo' });
                setShowModal(false);
            } else {
                alert("Hubo un error al crear la tarea.");
            }
        }
    };
    

    return (
        <div className="container mt-2">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="container mt-4 d-flex justify-content-between align-items-center gap-3">
                    <h1 className="fw-bold">Tareas</h1>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        Agregar
                    </button>
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Buscar tarea..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            {tasks.map(task => (
            <div className="card mb-4" key={task.id}>
                <div className="card-header fw-bold">{task.name}</div>
                <div className="card-body">
                    <blockquote className="blockquote mb-2">
                        <p>Fase: {task.phase.phase}</p>
                        <footer className="blockquote-footer">
                            <cite>{task.completed?'Completo':'Incompleto'}</cite>
                        </footer>
                    </blockquote>
                </div>
            </div>
        ))}


            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => goToPage(currentPage - 1)}>Anterior</button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                            <button className="page-link" onClick={() => goToPage(i + 1)}>{i + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => goToPage(currentPage + 1)}>Siguiente</button>
                    </li>
                </ul>
            </nav>

            {/* Modal */}
            {showModal && (
                <div className="modal d-block fade show" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nueva Tarea</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Título</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fase</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newTask.fase}
                                            onChange={(e) => setNewTask({ ...newTask, fase: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Estado</label>
                                        <select
                                            className="form-control"
                                            value={newTask.status}
                                            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                                        >
                                            <option value="Activo">Activo</option>
                                            <option value="Desactivo">Desactivo</option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleAddTask}>
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Task;
