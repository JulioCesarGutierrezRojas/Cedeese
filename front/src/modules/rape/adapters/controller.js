import { handleRequest } from "../../../config/http-client.gateway.js";

// Obtener todos los proyectos
export const getProjects = async (employeeId, role) => {
    const payload = {
        employeeId: employeeId ? Number(employeeId) : null,
        role: role ? role.toUpperCase() : ''
    };

    // Log the payload for debugging
    const response = await handleRequest('post', 'projects/get-all', payload);

    return response.data || response.result || [];
};

// Cerrar un proyecto por ID
export const closeProject = async (projectId) => {
    return await handleRequest('put', 'projects/complete', { id: Number(projectId) });
};
