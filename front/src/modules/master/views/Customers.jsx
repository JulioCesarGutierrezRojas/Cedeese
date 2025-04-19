import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';

const Customers = () => {
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
            <h3 className="mb-3 text-center">Lista de Empleados</h3>
            <table className="table table-hover table-bordered">
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
                <div className="modal-dialog">
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
                                    <p><strong>ID:</strong> {selectedEmployee.id}</p>
                                    <p><strong>Nombre:</strong> {selectedEmployee.name}</p>
                                    <p><strong>Apellido:</strong> {selectedEmployee.surname}</p>
                                    <p><strong>Email:</strong> {selectedEmployee.email}</p>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Customers;
