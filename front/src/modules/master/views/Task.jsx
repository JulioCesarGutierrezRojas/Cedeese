import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Task = () => {
    const tasks = [
        { id: 1, text: "Do the dishes" },
        { id: 2, text: "Finish homework" },
        { id: 3, text: "Read a book" },
        { id: 4, text: "Go for a run" },
        { id: 5, text: "Write a blog post" },
        { id: 6, text: "Cook dinner" },
        { id: 7, text: "Call mom" },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-0">Tareas</h1>
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Buscar tarea..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset page when searching
                    }}
                />
            </div>

            {currentTasks.map(task => (
                <div className="card mb-4" key={task.id}>
                    <div className="card-header">Tarea #{task.id}</div>
                    <div className="card-body">
                        <blockquote className="blockquote mb-2">
                            <p>Fase</p>
                            <footer className="blockquote-footer">
                                <cite title="Source Title">Fuente desconocida</cite>
                            </footer>
                        </blockquote>
                    </div>
                </div>
            ))}

            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                            Anterior
                        </button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                            <button className="page-link" onClick={() => goToPage(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                            Siguiente
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Task;
