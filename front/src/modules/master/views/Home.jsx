import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Home = () => {
    const projects = [
        { id: 1, title: "Proyecto 1", description: "Este es el primer proyecto que se elabora" },
        { id: 2, title: "Hamburguesa", description: "Este es el segundo proyecto" },
        { id: 3, title: "Pizza", description: "Este es el tercer proyecto" },
        { id: 4, title: "Chilaquiles", description: "Este es cuarto" },
        { id: 5, title: "Huevos Revueltos", description: "Este es el quinto" },
        { id: 6, title: "Espagueti Verde", description: "Este es el sexto" },
        { id: 7, title: "Molletes", description: "Este es el séptimo" },
        { id: 8, title: "Tacos", description: "Este es el octavo" },
        { id: 9, title: "Enchiladas", description: "Este es el noveno" },
        { id: 10, title: "Tamales", description: "Este es el décimo" },
        { id: 11, title: "Pan de muerto", description: "Este es el onceavo" },
        { id: 12, title: "Pozole", description: "Este es el doceavo" },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const totalPages = Math.ceil(projects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="container mt-1">
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th className="text-center">Proyectos</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div className="row">
                                {currentProjects.map(project => (
                                    <div key={project.id} className="col-md-4 mb-3">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <h5 className="card-title">{project.title}</h5>
                                                <p className="card-text">{project.description}</p>
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
        </div>
    );
};

export default Home;
