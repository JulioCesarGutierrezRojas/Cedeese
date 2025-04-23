import {handleRequest} from "../../../config/http-client.gateway.js";


export const getProjectsByEmployee = async (employeeId) => {
    const response = await handleRequest('post', '/projects/get-by-employee', {
        employeeId,
    });
    console.log("Esta es la respuesta que me trae el metodo de proyectos: ", response);
    if (response.type !== 'SUCCESS') throw new Error(response.text);

    const projects = response.result || response.data;
    console.log("Projects data after processing:", projects);

    return projects;
}


export const getTaskByProject = async (projectId, phaseId) => {
    const response = await handleRequest('post', '/tasks/project-tasks', {
        projectId, phaseId
    });
    console.log("Response from getTaskByProject:", response);
    if (response.type !== 'SUCCESS') throw new Error(response.text);

    const tasks = response.result || response.data;
    console.log("Tasks data after processing:", tasks);

    return tasks;
}


export const markTaskCompleted = async (id) => {
    const response = await handleRequest('patch', '/tasks/mark-completed', { id });
    console.log("Respuesta al marcar tarea como completada:", response);
    if (response.type !== 'SUCCESS') throw new Error(response.text);

    return response.result || response.data;
}