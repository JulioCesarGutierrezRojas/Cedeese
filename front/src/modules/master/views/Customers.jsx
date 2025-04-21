import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../adapters/controllerCustomer';
import { showSuccessToast, showErrorToast } from '../../../kernel/alerts';

const Customers = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await getEmployees();
                if (response && response.data) {
                    setEmployees(response.data);
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);
    const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
    const [newEmployee, setNewEmployee] = useState({ name: '', surname: '', email: '' , username:'', password: ''});

    const handleAddClick = () => setShowNewEmployeeModal(true);
    const handleCloseNewModal = () => setShowNewEmployeeModal(false);

    // Handler for saving a new employee
    const handleSaveNewEmployee = async () => {
        try {
            // Transform the data to match the backend's expected structure
            const employeeData = {
                username: newEmployee.username,
                password: newEmployee.password,
                name: newEmployee.name,
                lastname: newEmployee.surname, // Map surname to lastname
                email: newEmployee.email
            };

            // Only add rolId if it's a valid number
            const rolId = parseInt(newEmployee.rol);
            if (!isNaN(rolId)) {
                employeeData.rolId = rolId;
            }

            const response = await createEmployee(employeeData);
            if (response && response.data) {
                // Add the new employee to the list
                setEmployees([...employees, response.data]);
                // Show success toast notification
                showSuccessToast({
                    title: 'Usuario creado exitosamente',
                    text: `${response.data.name} ${response.data.lastname || response.data.surname} ha sido agregado`,
                    onCloseCallback: () => {
                        // Refresh the page after the toast is closed
                        window.location.reload();
                    }
                });
                // Reset the form and close the modal
                setNewEmployee({ name: '', surname: '', email: '', username: '', password: '', rol: '' });
                setShowNewEmployeeModal(false);
            }
        } catch (error) {
            console.error('Error creating employee:', error);
        }
    };

    // Handler for updating an existing employee
    const handleUpdateEmployee = async () => {
        if (!selectedEmployee) return;

        try {
            const response = await updateEmployee(selectedEmployee.id, selectedEmployee);
            if (response && response.data) {
                // Update the employee in the list
                setEmployees(employees.map(emp =>
                    emp.id === selectedEmployee.id ? response.data : emp
                ));
                // Show success toast notification
                showSuccessToast({
                    title: 'Usuario actualizado exitosamente',
                    text: `${response.data.name} ${response.data.lastname || response.data.surname} ha sido actualizado`,
                    onCloseCallback: () => {
                        // Refresh the page after the toast is closed
                        window.location.reload();
                    }
                });
                // Close the modal
                const modalElement = document.getElementById('employeeModal');
                const modalInstance = Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                }
            } else {
                // Show error toast notification if response doesn't contain data
                showErrorToast({
                    title: 'Error al actualizar usuario',
                    text: response?.text || 'No se pudo actualizar el usuario. Inténtelo de nuevo.'
                });
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            // Show error toast notification
            showErrorToast({
                title: 'Error al actualizar usuario',
                text: 'No se pudo actualizar el usuario. Inténtelo de nuevo.'
            });
        }
    };

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        const modalElement = document.getElementById('employeeModal');
        const modalInstance = new Modal(modalElement);
        modalInstance.show();
    };

    const handleDeleteClick = async (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
            try {
                const response = await deleteEmployee(id);
                if (response) {
                    // Remove the employee from the list
                    setEmployees(employees.filter(emp => emp.id !== id));
                    // Show success toast notification
                    showSuccessToast({
                        title: 'Usuario eliminado exitosamente',
                        text: 'El usuario ha sido eliminado',
                        onCloseCallback: () => {
                            // Refresh the page after the toast is closed
                            window.location.reload();
                        }
                    });
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
                // Show error toast notification
                showErrorToast({
                    title: 'Error al eliminar usuario',
                    text: 'No se pudo eliminar el usuario. Inténtelo de nuevo.'
                });
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="container mt-4 d-flex justify-content-between align-items-center">
                <h1 className="fw-bold">Empleados</h1>
                <button className="btn btn-primary" onClick={handleAddClick}>
                    Agregar
                </button>
            </div>
            <table className="table table-hover table-bordered mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.name} {emp.surname || emp.lastname}</td>
                            <td>{emp.email}</td>
                            <td>
                                <button 
                                    className="btn btn-primary btn-sm me-2" 
                                    onClick={() => handleEditClick(emp)}
                                >Actualizar
                                </button>
                                <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteClick(emp.id)}
                                >Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
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
                            <label><strong>Username:</strong></label>
                            <input className="form-control" value={selectedEmployee.username}
                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, username: e.target.value })}/>

                            <label><strong>Nombre:</strong></label>
                            <input className="form-control" value={selectedEmployee.name}
                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}/>

                            <label className="mt-2"><strong>Apellido:</strong></label>
                            <input className="form-control" value={selectedEmployee.surname || selectedEmployee.lastname}
                                onChange={(e) => setSelectedEmployee({
                                    ...selectedEmployee,
                                    surname: e.target.value,
                                    lastname: e.target.value // Update both fields to ensure compatibility
                                })}/>

                            <label className="mt-2"><strong>Email:</strong></label>
                            <input className="form-control" value={selectedEmployee.email}
                                onChange={(e) =>setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}/>

                                <label className="mt-2"><strong>Rol:</strong></label>
                            <input className="form-control" value={typeof selectedEmployee.rol === 'object' ? selectedEmployee.rol.id || '' : selectedEmployee.rol}
                                onChange={(e) =>setSelectedEmployee({ ...selectedEmployee, rol: e.target.value })}/>
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
                                        className="form-control"
                                        value={newEmployee.username}
                                        onChange={(e) =>
                                            setNewEmployee({ ...newEmployee, username: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Nombre:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newEmployee.name}
                                        onChange={(e) =>
                                            setNewEmployee({ ...newEmployee, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Apellido:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newEmployee.surname}
                                        onChange={(e) =>
                                            setNewEmployee({ ...newEmployee, surname: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Rol:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newEmployee.rol}
                                        onChange={(e) =>
                                            setNewEmployee({ ...newEmployee, rol: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={newEmployee.email}
                                        onChange={(e) =>
                                            setNewEmployee({ ...newEmployee, email: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Contraseña:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={newEmployee.password}
                                        onChange={(e) =>
                                            setNewEmployee({ ...newEmployee, password: e.target.value })
                                        }
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleCloseNewModal}
                            >
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveNewEmployee}>
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

export default Customers;
