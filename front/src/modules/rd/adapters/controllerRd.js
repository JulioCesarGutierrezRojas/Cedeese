import { handleRequest } from '../../../config/http-client.gateway.js';
import swal from 'sweetalert2';


export const createTask = async (taskData) => {
    try {
        console.log('[DEBUG] Datos para crear tarea:', {
            name: taskData.name,
            projectId: Number(taskData.projectId),
            phaseId: Number(taskData.currentPhase?.id || 1),
            completed: false
        });

        const response = await handleRequest(
            'post',
            '/tasks/',
            {
                name: taskData.name,
                projectId: Number(taskData.projectId),
                phaseId: Number(taskData.currentPhase?.id || 1),
                completed: false
            }
        );

        console.log('[DEBUG] Respuesta del servidor:', response);

        if (!response) {
            throw new Error('El servidor no respondió');
        }

        // Adaptación para diferentes formatos de respuesta
        if (response.success || response.type === 'SUCCESS') {
            return {
                success: true,
                task: response.data || response.result
            };
        } else {
            const errorMessage = response.message || response.text || 'Error al crear la tarea';
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Error en createTask:', {
            message: error.message,
            response: error.response,
            stack: error.stack
        });

        const errorMsg = error.response?.data?.message ||
            error.response?.text ||
            error.message ||
            'No se pudo crear la tarea';

        swal.fire({
            title: 'Error',
            text: errorMsg,
            icon: 'error'
        });

        return {
            success: false,
            error: errorMsg
        };
    }

};

export const getProjectsByCurrentEmployee = async (employeeId) => {
    try {
        console.log('[DEBUG] Obteniendo proyectos para empleado:', employeeId);

        if (!employeeId) {
            throw new Error('ID de empleado no proporcionado');
        }

        const response = await handleRequest(
            'post',
            '/projects/get-by-employee',
            { employeeId }
        );

        if (!response) {
            throw new Error('El servidor no respondió');
        }

        if (response.type === 'SUCCESS') {
            return {
                success: true,
                projects: Array.isArray(response.result) ? response.result : [response.result]
            };
        } else {
            throw new Error(response.text || 'Error al obtener proyectos');
        }
    } catch (error) {
        console.error('Error en getProjectsByCurrentEmployee:', error);
        throw error;
    }

};

export const getTasksByProject = async (projectId) => {
    try {
        console.log('[DEBUG] Solicitando tareas para projectId:', projectId);

        const response = await handleRequest(
            'post',
            '/tasks/project-tasks',
            { projectId }
        );

        console.log('[DEBUG] Respuesta completa:', response);

        // Verificación mejorada de la respuesta
        if (!response) {
            throw new Error('No se recibió respuesta del servidor');
        }


        if (response.type === 'SUCCESS') {
            // Priorizar response.result si existe, luego response.data
            const tasks = response.result || response.data || [];

            return {
                success: true,
                tasks: Array.isArray(tasks) ? tasks : [tasks]
            };
        } else {
            throw new Error(response.text || 'El servidor reportó un error');
        }
    } catch (error) {
        console.error('[ERROR] Detalles del error:', {
            message: error.message,
            response: error.response,
            timestamp: new Date().toISOString()
        });

        throw new Error(error.message || 'Error al obtener las tareas');
    }

};

export const moveToNextPhase = async (projectId, currentPhaseId) => {
    try {
        console.log('[DEBUG] Datos para cambio de fase:', {
            projectId: Number(projectId),
            currentPhaseId: Number(currentPhaseId)
        });

        const response = await handleRequest(
            'post',
            '/phases/next-phase',
            {
                projectId: Number(projectId),
                currentPhaseId: Number(currentPhaseId)
            }
        );

        console.log('[DEBUG] Respuesta del servidor:', response);

        if (!response) {
            throw new Error('El servidor no respondió');
        }

        // Manejo de diferentes formatos de respuesta
        if (response.type === 'SUCCESS' || response.success) {
            return {
                success: true,
                newPhase: response.data || response.result,
                message: response.text || 'Fase cambiada exitosamente'
            };
        } else {
            throw new Error(response.text || response.message || 'Error al cambiar de fase');
        }
    } catch (error) {
        console.error('[ERROR] Detalles del fallo:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            timestamp: new Date().toISOString()
        });

        let errorMessage = error.message;
        if (error.response?.status === 400) {
            errorMessage = error.response.data?.message ||
                'Datos inválidos para cambiar de fase';
        }

        throw new Error(errorMessage);
    }

};



export const deleteTask = async (taskId) => {
    try {
        console.log('[DEBUG] Eliminando tarea con ID:', taskId);

        const response = await handleRequest(
            'delete',
            '/tasks/',
            { id: taskId }
        );

        console.log('[DEBUG] Respuesta del servidor:', response);

        if (!response) {
            throw new Error('El servidor no respondió');
        }

        // Manejo de diferentes formatos de respuesta
        if (response.success || response.type === 'SUCCESS') {
            return {
                success: true,
                message: response.message || 'Tarea eliminada correctamente'
            };
        } else {
            const errorMessage = response.message || response.text || 'Error al eliminar la tarea';
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Error en deleteTask:', {
            message: error.message,
            response: error.response,
            stack: error.stack
        });

        const errorMsg = error.response?.data?.message ||
            error.response?.text ||
            error.message ||
            'No se pudo eliminar la tarea';

        swal.fire({
            title: 'Error',
            text: errorMsg,
            icon: 'error'
        });

        return {
            success: false,
            error: errorMsg
        };
    }
};