import {handleRequest} from "../../../config/http-client.gateway.js";

// Obtener todos los empleados
export const getEmployees = async () => {
    const response = await handleRequest('get', '/employees/');
    console.log("Response from getEmployees:", response);
    return response;
};

// Crear un nuevo empleado
export const createEmployee = async (employeeData) => {
    const response = await handleRequest('post', '/employees/', employeeData);
    return response;
};

// Actualizar un empleado existente
export const updateEmployee = async (id, employeeData) => {
    // Transform the data to match the backend's expected structure
    const formattedData = {
        id: id,
        username: employeeData.username,
        name: employeeData.name,
        lastname: employeeData.lastname || employeeData.surname,
        email: employeeData.email
    };

    let rolId;
    if (typeof employeeData.rol === 'object' && employeeData.rol !== null) {
        rolId = parseInt(employeeData.rol.id);
    } else {
        rolId = parseInt(employeeData.rol);
    }

    formattedData.rolId = !isNaN(rolId) ? rolId : 1;

    const response = await handleRequest('put', '/employees/', formattedData);
    return response;
};


export const deleteEmployee = async (id) => {
    const response = await handleRequest('delete', '/employees/', { id } );
    return response;
};
