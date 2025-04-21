
import { handleRequest } from '../../../config/http-client.gateway.js';
import swal from 'sweetalert2';

export const createTask = async (taskData) => {
    try {
        const response = await handleRequest(
            'post',
            '/api/tasks',
            {
                name: taskData.name,
                project_id: taskData.project_id,
                phase_id: taskData.phase_id // 1 por defecto
                // completed no se envía (se asume false en backend)
            }
        );

        if (response.type === 'SUCCESS') {
            return { success: true, task: response.result };
        } else {
            swal.fire({
                title: 'Error',
                text: response.text || 'Error al crear la tarea',
                icon: 'error'
            });
            return { success: false, error: response.text };
        }
    } catch (error) {
        console.error('Error en createTask:', error);
        swal.fire({
            title: 'Error inesperado',
            text: 'No se pudo conectar al servidor',
            icon: 'error'
        });
        return { success: false, error: 'Error interno del servidor' };
    }
};

export const getProjects = async () => {
    try {
        const response = await handleRequest('get', '/api/projects');
        return {
            success: response.type === 'SUCCESS',
            projects: response.result || []
        };
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        return { success: false, projects: [] };
    }
};

// Opcional: Otros métodos relacionados con tareas
export const updateTaskStatus = async (taskId, completed) => {
    return handleRequest('patch', `/api/tasks/${taskId}`, { completed });
};