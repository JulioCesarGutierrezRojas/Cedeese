import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Task = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title:'Supervisar empleados', fase: "Do the dishes", status: 'Activo' },
        { id: 2, title:'Supervisar empleados', fase: "Finish homework", status: 'Activo' },
        { id: 3, title:'Supervisar empleados', fase: "Read a book", status: 'Activo' },
        { id: 4, title:'Supervisar tareas', fase: "Go for a run", status: 'Activo' },
        { id: 5, title:'Supervisar empleados', fase: "Write a blog post", status: 'Activo' },
        { id: 6, title:'Supervisar empleados', fase: "Cook dinner", status: 'Activo' },
        { id: 7, title:'Supervisar empleados', fase: "Call mom", status: 'Desactivo' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', fase: '', status: 'Activo' });
    const itemsPerPage = 3;

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.fase.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleAddTask = () => {
        if (newTask.title && newTask.fase) {
            const newId = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
            setTasks([...tasks, { ...newTask, id: newId }]);
            setNewTask({ title: '', fase: '', status: 'Activo' });
            setShowModal(false);
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

            {currentTasks.map(task => (
                <div className="card mb-4" key={task.id}>
                    <div className="card-header">{task.title}</div>
                    <div className="card-body">
                        <blockquote className="blockquote mb-2">
                            <p>{task.fase}</p>
                            <footer className="blockquote-footer">
                                <cite>{task.status}</cite>
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
