import { handleRequest } from "../../../config/http-client.gateway.js";

export const getAllTask = async () => {
    try {
        const response = await handleRequest('get', '/tasks/');
        return response;
    } catch (error) {
    console.error("Error en getTak:", error);
        return [];
    }
};

export const createTask = async (taskData) => {
    try {
        const response = await handleRequest('post', '/tasks/', taskData);
        return response;
    } catch (error) {
        console.error("Error al crear tarea:", error);
        return null;
    }
};