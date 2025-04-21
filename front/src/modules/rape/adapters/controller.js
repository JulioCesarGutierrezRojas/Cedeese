import { handleRequest } from "../../../config/http-client.gateway.js";

// Obtener todos los proyectos
export const getProjects = async (employeeId, role) => {
    // Ensure we're sending the data in the format the API expects
    // Handle potential null/undefined values and ensure correct types
    const payload = {
        employeeId: employeeId ? Number(employeeId) : null,
        role: role ? role.toUpperCase() : ''
    };

    // Log the payload for debugging
    console.log("Sending payload to API:", payload);

    const response = await handleRequest('post', 'projects/get-all', payload);

    // Asegúrate de que solo retornas el arreglo
    console.log("Des controller de GET: ", response);
    // Try to get data from different possible properties
    return response.data || response.result || [];
};

// Cerrar un proyecto por ID
export const closeProject = async (projectId) => {
    return await handleRequest('put', 'projects/complete', { id: projectId });
};
