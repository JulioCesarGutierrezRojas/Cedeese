import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Home = () => {
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const projects = [
        { id: 1, title: "Proyecto 1", identify: "Este es el primer proyecto que se elabora" , fase: "Activo"},
        { id: 2, title: "Hamburguesa", identify: "Este es el segundo proyecto", fase: "Desactivo" },
        { id: 3, title: "Pizza", identify: "Este es el tercer proyecto" , fase: "Activo"},
        { id: 4, title: "Chilaquiles", identify: "Este es cuarto", fase: "Activo" },
        { id: 5, title: "Huevos Revueltos", identify: "Este es el quinto", fase: "Activo" },
        { id: 6, title: "Espagueti Verde", identify: "Este es el sexto", fase: "Activo" },
        { id: 7, title: "Molletes", identify: "Este es el séptimo" , fase: "Activo"},
        { id: 8, title: "Tacos", identify: "Este es el octavo", fase: "Activo" },
        { id: 9, title: "Enchiladas", identify: "Este es el noveno", fase: "Activo" },
        { id: 10, title: "Tamales", identify: "Este es el décimo" , fase: "Activo"},
        { id: 11, title: "Pan de muerto", identify: "Este es el onceavo" , fase: "Activo"},
        { id: 12, title: "Pozole", identify: "Este es el doceavo" , fase: "Activo"},
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const totalPages = Math.ceil(projects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="container">
            <div className="container mt-4 d-flex justify-content-between align-items-center">
                <h1 className="fw-bold">Proyectos</h1>
                <button className="btn btn-primary" onClick={handleShow}>
                    Agregar
                </button>
            </div>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td>
                            <div className="row">
                                {currentProjects.map(project => (
                                    <div key={project.id} className="col-md-4 mb-2">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <h4 className="card-title">{project.title}</h4>
                                                <p className="card-text">{project.identify}</p>
                                                <h5 className='fw-bold'>{project.fase}</h5>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            
            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Anterior</button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                        <li
                            key={index}
                            className={`page-item ${currentPage === index + 1 && 'active'}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Siguiente</button>
                    </li>
                </ul>
            </nav>

            {/* Modal */}
            {showModal && (
                <div className="modal m-5 show d-block" tabIndex="-1">
                    <div className="modal-dialog shadow-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nuevo Proyecto</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleClose}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="projectName" className="form-label">Título:</label>
                                        <input type="text" className="form-control" id="projectName" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="identify" className="form-label">Identificador:</label>
                                        <input type='text' className="form-control" id="identify"></input>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="projectName" className="form-label">Fase:</label>
                                        <input type="text" className="form-control" id="projectName" />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={handleClose}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
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

export default Home;
