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
        const response = await handleRequest('get', '/projects');
        return {
            success: response.type === 'SUCCESS',
            projects: response.result || []
        };
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        return { success: false, projects: [] };
    }
};

export const getTasks = async () => {
    try {
        const response = await handleRequest('get', '/api/tasks');
        return {
            success: response.type === 'SUCCESS',
            tasks: response.result || response.data || []
        };
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        swal.fire({
            title: 'Error',
            text: 'No se pudieron cargar las tareas',
            icon: 'error'
        });
        return { success: false, tasks: [] };
    }
};

export const deleteTask = async (taskId) => {
    try {
        const response = await handleRequest('delete', `/api/tasks/${taskId}`);
        return {
            success: response.type === 'SUCCESS',
            message: response.text || 'Tarea eliminada correctamente'
        };
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar la tarea',
            icon: 'error'
        });
        return { success: false, error: 'Error al eliminar la tarea' };
    }
};

// Opcional: Otros métodos relacionados con tareas
export const updateTaskStatus = async (taskId, completed) => {
    try {
        const response = await handleRequest('patch', `/api/tasks/${taskId}`, { completed });
        return {
            success: response.type === 'SUCCESS',
            message: response.text || 'Estado de tarea actualizado correctamente'
        };
    } catch (error) {
        console.error('Error al actualizar estado de tarea:', error);
        return { success: false, error: 'Error al actualizar estado de tarea' };
    }
};
