import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../adapters/controllerCustomer';
import { showSuccessToast, showConfirmation, showWarningToast } from '../../../kernel/alerts.js';
import Loader from '../../../components/Loader';
import ErrorBoundary from '../../../components/ErrorBoundary';
import {useLocation, useNavigate} from "react-router";

const Customers = () => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
    const [newEmployee, setNewEmployee] = useState({name: '', surname: '', email: '', username: '', password: '', rol: ''});
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            const response = await getEmployees();
            setEmployees(response.result);
        } catch (error) {
            showWarningToast({
                title: 'Error al cargar empleados',
                text: error?.message || 'Error desconocido al cargar los empleados'
            });
        } finally {
            setIsLoading(false);
        }
    };
    const validateForm = (employee) => {
        const errors = {};
        if (!employee.username?.trim()) errors.username = 'El username es requerido';
        if (!employee.name?.trim()) errors.name = 'El nombre es requerido';
        if (!employee.surname?.trim() && !employee.lastname?.trim()) errors.surname = 'El apellido es requerido';
        if (!employee.email?.trim()) errors.email = 'El email es requerido';
        if (!employee.rol) errors.rol = 'El rol es requerido';
        if (!employee.password?.trim() && !employee.id) errors.password = 'La contraseña es requerida';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddClick = () => {
        setNewEmployee({name: '', surname: '', email: '', username: '', password: '', rol: ''});
        setFormErrors({});
        setShowNewEmployeeModal(true);
    };

    const handleCloseNewModal = () => {
        setShowNewEmployeeModal(false);
        setFormErrors({});
    };

    const handleCreateEmployee = async () => {
        if (!validateForm(newEmployee)) return;

        setIsLoading(true);
        try {
            const employeeData = {
                username: newEmployee.username,
                password: newEmployee.password,
                name: newEmployee.name,
                lastname: newEmployee.surname,
                email: newEmployee.email,
                rolId: parseInt(newEmployee.rol) || undefined,
            };

            const response = await createEmployee(employeeData);

            if (response && response.data) {
                setEmployees([...employees, response.data]);
                showSuccessToast({
                    title: 'Empleado creado',
                    text: 'El empleado ha sido creado exitosamente'
                });
                handleCloseNewModal();
            } else {
                throw new Error(response?.text || 'No se pudo crear el empleado');
            }
        } catch (error) {
            showWarningToast({
                title: 'Error al crear empleado',
                text: error?.message || 'Error desconocido al crear el empleado'
            });
        } finally {
            handleCloseNewModal()
            fetchEmployees();
            setIsLoading(false);
        }
    };

    const handleUpdateEmployee = async () => {
        if (!selectedEmployee || !validateForm(selectedEmployee)) return;
        setIsLoading(true);
        try {
            const response = await updateEmployee(selectedEmployee.id, selectedEmployee);
            console.log("response " , response)
            if (response) {
                // Update the employee in the state with the result from the response
                if (response.result) {
                    setEmployees(employees.map(emp =>
                        emp.id === selectedEmployee.id ? response.result : emp
                    ));
                } else {
                    // If no result, just refresh the employees list
                    await fetchEmployees();
                }
                
                showSuccessToast({
                    title: 'Empleado actualizado',
                    text: 'El empleado ha sido actualizado exitosamente'
                });

                const modalElement = document.getElementById('employeeModal');
                const modalInstance = Modal.getInstance(modalElement);
                
                if (modalInstance) modalInstance.hide();
            } else {
                throw new Error(response?.text || 'No se pudo actualizar el empleado');
            }
        } catch (error) {
            showWarningToast({
                title: 'Error al actualizar empleado',
                text: error?.message || 'Error desconocido al actualizar el empleado'
            });
        } finally {
            fetchEmployees()
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        showConfirmation('¿Eliminar empleado?', 'Esta acción no se puede deshacer.', 'warning', () => onDelete(id));

    };

    const onDelete = async (id) => {
        setIsLoading(true);
        try {
            await deleteEmployee(id);
            showSuccessToast({
                title: 'Empleado eliminado',
                text: 'El empleado ha sido eliminado exitosamente'
            });
        } catch (error) {
            showWarningToast({
                title: 'Error al eliminar empleado',
                text: error?.message || 'Error desconocido al eliminar el empleado'
            });
        } finally {

            fetchEmployees()
            setIsLoading(false);
        }
    }



    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        
        setFormErrors({});
        const modalElement = document.getElementById('employeeModal');
        const modalInstance = new Modal(modalElement);
        modalInstance.show();
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(employees.length / itemsPerPage);
    

    return (
        <ErrorBoundary>
            <div className="container mt-4">
                <Loader isLoading={isLoading} />

                <div className="container mt-4 d-flex justify-content-between align-items-center">
                    <h1 className="fw-bold">Empleados</h1>
                    <button className="btn btn-primary" onClick={handleAddClick}>Agregar</button>
                </div>

                <table className="table table-hover table-bordered mt-3">
                    <thead className="table-dark">
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentEmployees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.name } {emp.surname || emp.lastname}</td>
                            <td>{emp.email}</td>
                            <td>{emp.rol.rol}</td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => handleEditClick(emp)}
                                >
                                    Actualizar
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteClick(emp.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Modal para editar empleado */}
                <div className="modal fade" id="employeeModal" tabIndex="-1" aria-labelledby="employeeModalLabel" aria-hidden="true">
                    <div className="modal-dialog mt-5 pt-5">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="employeeModalLabel">
                                    {selectedEmployee ? `${selectedEmployee.name} ${selectedEmployee.surname || selectedEmployee.lastname}` : 'Empleado'}
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                            </div>
                            <div className="modal-body">
                                {selectedEmployee && (
                                    <>
                                        <div className="mb-2">
                                            <label className="form-label"><strong>Username:</strong></label>
                                            <input
                                                className={`form-control ${formErrors.username ? 'is-invalid' : ''}`}
                                                value={selectedEmployee.username}
                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, username: e.target.value })}
                                            />
                                            {formErrors.username && <div className="invalid-feedback">{formErrors.username}</div>}
                                        </div>

                                        <div className="mb-2">
                                            <label className="form-label"><strong>Nombre:</strong></label>
                                            <input
                                                className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                                                value={selectedEmployee.name}
                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
                                            />
                                            {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                                        </div>

                                        <div className="mb-2">
                                            <label className="form-label"><strong>Apellido:</strong></label>
                                            <input
                                                className={`form-control ${formErrors.surname ? 'is-invalid' : ''}`}
                                                value={selectedEmployee.surname || selectedEmployee.lastname}
                                                onChange={(e) => setSelectedEmployee({
                                                    ...selectedEmployee,
                                                    surname: e.target.value,
                                                    lastname: e.target.value
                                                })}
                                            />
                                            {formErrors.surname && <div className="invalid-feedback">{formErrors.surname}</div>}
                                        </div>

                                        <div className="mb-2">
                                            <label className="form-label"><strong>Email:</strong></label>
                                            <input
                                                className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                                                value={selectedEmployee.email}
                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                                            />
                                            {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                                        </div>

                                        <div className="mb-2">
                                            <label className="form-label"><strong>Rol:</strong></label>
                                            <select
                                                className="form-control"
                                                value={selectedEmployee.rol.id}
                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, rol: parseInt(e.target.value) })}
                                            >
                                                <option value={0}>{selectedEmployee.rol.rol}</option>
                                                <option value={2}>RAPE</option>
                                                <option value={3}>RD</option>
                                                <option value={4}>AP</option>
                                            </select>

                                            {formErrors.rol && <div className="invalid-feedback">{formErrors.rol}</div>}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger fw-bold" data-bs-dismiss="modal">Cerrar</button>
                                <button type="button" className="btn btn-primary fw-bold" onClick={handleUpdateEmployee}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal para nuevo empleado */}
                {showNewEmployeeModal && (
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog shadow-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Nuevo Empleado</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseNewModal}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-2">
                                            <label className="form-label">Username:</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.username ? 'is-invalid' : ''}`}
                                                value={newEmployee.username}
                                                onChange={(e) =>
                                                    setNewEmployee({ ...newEmployee, username: e.target.value })
                                                }
                                            />
                                            {formErrors.username && <div className="invalid-feedback">{formErrors.username}</div>}
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Nombre:</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                                                value={newEmployee.name}
                                                onChange={(e) =>
                                                    setNewEmployee({ ...newEmployee, name: e.target.value })
                                                }
                                            />
                                            {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Apellido:</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.surname ? 'is-invalid' : ''}`}
                                                value={newEmployee.surname}
                                                onChange={(e) =>
                                                    setNewEmployee({ ...newEmployee, surname: e.target.value })
                                                }
                                            />
                                            {formErrors.surname && <div className="invalid-feedback">{formErrors.surname}</div>}
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Rol:</label>
                                            <select
                                                className="form-control"
                                                value={newEmployee.rol}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, rol: parseInt(e.target.value) })}
                                            >
                                                <option value="">Seleccionar rol</option>
                                                <option value={2}>RAPE</option>
                                                <option value={3}>RD</option>
                                                <option value={4}>AP</option>
                                            </select>

                                            {formErrors.rol && <div className="invalid-feedback">{formErrors.rol}</div>}
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Email:</label>
                                            <input
                                                type="email"
                                                className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                                                value={newEmployee.email}
                                                onChange={(e) =>
                                                    setNewEmployee({ ...newEmployee, email: e.target.value })
                                                }
                                            />
                                            {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Contraseña:</label>
                                            <input
                                                type="password"
                                                className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                                                value={newEmployee.password}
                                                onChange={(e) =>
                                                    setNewEmployee({ ...newEmployee, password: e.target.value })
                                                }
                                            />
                                            {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" onClick={handleCloseNewModal}>Cancelar</button>
                                    <button type="button" className="btn btn-primary" onClick={handleCreateEmployee}>Guardar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <nav className="d-flex justify-content-center">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                        Anterior
                    </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                        {i + 1}
                        </button>
                    </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                        Siguiente
                    </button>
                    </li>
                </ul>
                </nav>
            </div>
        </ErrorBoundary>
    );
};

export default Customers;