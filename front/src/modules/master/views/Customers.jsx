import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';

const Customers = () => {
    const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
    const [newEmployee, setNewEmployee] = useState({ name: '', surname: '', email: '' , username:'', password: ''});

    const handleAddClick = () => setShowNewEmployeeModal(true);
    const handleCloseNewModal = () => setShowNewEmployeeModal(false);

    const Employees = [
        { id: 1, name: "Anne", surname: "Montiel", email: "montiE@gmail.com" },
        { id: 2, name: "Juan", surname: "Pérez", email: "example@.com" },
        { id: 3, name: "Luis", surname: "Gómez", email: "example@gmail.com" },
        { id: 4, name: "Marta", surname: "Ruiz", email: "example@gmail.com" },
        { id: 5, name: "Lucía", surname: "López", email: "example@gmail.com" },
    ];

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleRowClick = (employee) => {
        setSelectedEmployee(employee);
        const modalElement = document.getElementById('employeeModal');
        const modalInstance = new Modal(modalElement);
        modalInstance.show();
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
                    </tr>
                </thead>
                <tbody>
                    {Employees.map(emp => (
                        <tr key={emp.id} onClick={() => handleRowClick(emp)} style={{ cursor: 'pointer' }}>
                            <td>{emp.name} {emp.surname}</td>
                            <td>{emp.email}</td>
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
                                {selectedEmployee ? `${selectedEmployee.name} ${selectedEmployee.surname}` : 'Empleado'}
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
                            <input className="form-control" value={selectedEmployee.surname}
                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, surname: e.target.value })}/>

                            <label className="mt-2"><strong>Email:</strong></label>
                            <input className="form-control" value={selectedEmployee.email}
                                onChange={(e) =>setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}/>

                                <label className="mt-2"><strong>Rol:</strong></label>
                            <input className="form-control" value={selectedEmployee.rol}
                                onChange={(e) =>setSelectedEmployee({ ...selectedEmployee, rol: e.target.value })}/>
                            </>
                        )}
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger fw-bold" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-primary fw-bold" >Guardar</button>
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
                                        type="email"
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

export default Customers;
