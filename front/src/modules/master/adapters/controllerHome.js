import { handleRequest } from "../../../config/http-client.gateway.js";

// Obtener todos los proyectos
export const getProjects = async (employeeId, role) => {
    const payload = {
        employeeId: employeeId ? Number(employeeId) : null,
        role: role ? role.toUpperCase() : ''
    };

    // Log the payload for debugging
    const response = await handleRequest('post', 'projects/get-all', payload);

    // Return the entire response object so we can check for errors
    return response;
};

export const createProject = async (name, identifier, startDate, endDate, employeeId) => {
    const payload = {
        name,
        identifier,
        startDate,
        endDate,
        employeeId: employeeId ? Number(employeeId) : null
    };

    // Send the create project request
    const response = await handleRequest('post', 'projects/', payload);

    // Return the entire response object so we can check for errors
    return response;
};
