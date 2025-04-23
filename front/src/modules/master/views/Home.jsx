import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { getProjects, createProject, getPhases } from '../adapters/controllerHome.js';
import Loader from '../../../components/Loader';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { showWarningToast, showSuccessToast } from '../../../kernel/alerts.js';

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [phases, setPhases] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [projectName, setProjectName] = useState('');
    const [projectIdentifier, setProjectIdentifier] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [formErrors, setFormErrors] = useState({});

    const handleShow = () => setShowModal(true);

    const handleClose = () => {
        setShowModal(false);
        resetForm();
    };

    const resetForm = () => {
        setProjectName('');
        setProjectIdentifier('');
        setStartDate('');
        setEndDate('');
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};
        if (!projectName.trim()) errors.name = 'El nombre del proyecto es requerido';
        if (!projectIdentifier.trim()) errors.identifier = 'El identificador es requerido';
        if (!startDate) errors.startDate = 'La fecha de inicio es requerida';
        if (!endDate) errors.endDate = 'La fecha de fin es requerida';
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            errors.dateRange = 'La fecha de inicio no puede ser posterior a la fecha de fin';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const employeeId = localStorage.getItem('id');

            // Format dates to ISO format
            const formattedStartDate = new Date(startDate).toISOString();
            const formattedEndDate = new Date(endDate).toISOString();

            const response = await createProject(
                projectName,
                projectIdentifier,
                formattedStartDate,
                formattedEndDate,
                employeeId
            );

            // Check if the project was created successfully
            if (response.type === 'ERROR') {
                throw new Error(response.text || 'Error al crear el proyecto');
            }

            // Add the new project to the projects list
            const newProject = response.data || {
                id: Date.now(), // Temporary ID if not provided by API
                name: projectName,
                identifier: projectIdentifier,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                status: true // Assuming new projects are active by default
            };

            // Update the projects list with the new project
            setProjects(prevProjects => [newProject, ...prevProjects]);

            // Reset to first page to show the new project
            setCurrentPage(1);

            showSuccessToast({
                title: 'Proyecto creado',
                text: 'El proyecto ha sido creado exitosamente'
            });

            // Close modal and reset form
            handleClose();
        } catch (error) {
            showWarningToast({
                title: 'Error al crear proyecto',
                text: error?.message || 'Error desconocido al crear el proyecto'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch projects
                const employeeId = localStorage.getItem('id');
                const role = localStorage.getItem('role');
                const projectsResponse = await getProjects(employeeId, role);

                // Check if the projects response has an error
                if (projectsResponse.type === 'ERROR') {
                    throw new Error(projectsResponse.text || 'Error al cargar proyectos');
                }

                // Set the projects from the response data
                setProjects(projectsResponse.data || projectsResponse.result || []);

                // Fetch phases
                const phasesResponse = await getPhases();

                // Check if the phases response has an error
                if (phasesResponse.type === 'ERROR') {
                    throw new Error(phasesResponse.text || 'Error al cargar fases');
                }

                // Set the phases from the response data
                setPhases(phasesResponse.data || phasesResponse.result || []);
            } catch (error) {
                showWarningToast({
                    title: 'Error al cargar datos',
                    text: error?.message || 'Error desconocido al cargar datos'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

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
            <ErrorBoundary>
                <Loader isLoading={isLoading} />
            </ErrorBoundary>
            <div className="container mt-4 d-flex justify-content-between align-items-center">
                <h1 className="fw-bold">Proyectos</h1>
                <button className="btn btn-primary" onClick={handleShow}>Agregar</button>
            </div>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td>
                            <div className="row">
                                {currentProjects.length > 0 ? (
                                    currentProjects.map(project => (
                                        <div key={project.id} className="col-md-4 mb-2">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <h4 className="card-title">{project.name || project.title}</h4>
                                                    <p className="card-text">{project.identifier || project.identify}</p>
                                                    <p className="card-text"><strong>Fase:</strong> {project.phase || project.fase || "No especificada"}</p>
                                                    <h5 className='fw-bold'>{project.status ? "Activo" : "Inactivo"}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center mt-5 col-12">
                                        <h5 className="text-muted">No se encontraron proyectos</h5>
                                    </div>
                                )}
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
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="projectName" className="form-label">Nombre:</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${formErrors.name ? 'is-invalid' : ''}`} 
                                            id="projectName"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                        />
                                        {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="projectIdentifier" className="form-label">Identificador:</label>
                                        <input 
                                            type='text' 
                                            className={`form-control ${formErrors.identifier ? 'is-invalid' : ''}`} 
                                            id="projectIdentifier"
                                            value={projectIdentifier}
                                            onChange={(e) => setProjectIdentifier(e.target.value)}
                                        />
                                        {formErrors.identifier && <div className="invalid-feedback">{formErrors.identifier}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="startDate" className="form-label">Fecha de inicio:</label>
                                        <input 
                                            type="date" 
                                            className={`form-control ${formErrors.startDate ? 'is-invalid' : ''}`} 
                                            id="startDate"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                        {formErrors.startDate && <div className="invalid-feedback">{formErrors.startDate}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="endDate" className="form-label">Fecha de fin:</label>
                                        <input 
                                            type="date" 
                                            className={`form-control ${formErrors.endDate ? 'is-invalid' : ''}`} 
                                            id="endDate"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                        {formErrors.endDate && <div className="invalid-feedback">{formErrors.endDate}</div>}
                                    </div>
                                    {formErrors.dateRange && (
                                        <div className="alert alert-danger">{formErrors.dateRange}</div>
                                    )}
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={handleClose}>Cancelar</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
