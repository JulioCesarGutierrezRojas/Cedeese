import {handleRequest} from "../../../config/http-client.gateway.js";



export const markTaskComplete = async (id) => {
    const response = await handleRequest('post', '/tasks/mark-completed', {id});
    console.log("Response from markTaskComplete:", response);
    if (response.type !== 'SUCCESS') throw new Error(response.text);

    // Check if response.result is null or undefined, and try to use response.data instead
    const result = response.result || response.data;
    console.log("Result after processing:", result);

    return result;
}

export const getProjectsByEmployee = async (employeeId) => {
    const response = await handleRequest('post', '/projects/get-by-employee', {
        employeeId,
    });
    console.log("Esta es la respuesta que me trae el metodo de proyectos: ", response);
    if (response.type !== 'SUCCESS') throw new Error(response.text);

    // Check if response.result is null or undefined, and try to use response.data instead
    const projects = response.result || response.data;
    console.log("Projects data after processing:", projects);

    return projects;
}

export const getTaskById = async (id) => {
    const response = await handleRequest('get', '/tasks/one', {
        id,
    });
    console.log("Esta es la respuesta que me trae el metodo de tareas: ", response);
    if (response.type !== 'SUCCESS') throw new Error(response.text);

    // Check if response.result is null or undefined, and try to use response.data instead
    const task = response.result || response.data;
    console.log("Task data after processing:", task);

    return task;
}

export const getTaskByProject = async (projectId, phaseId) => {
    const response = await handleRequest('post', '/tasks/project-tasks', {
        projectId,phaseId
    });
    console.log("Response from getTaskByProject:", response);
    if (response.type !== 'SUCCESS') throw new Error(response.text);

    // Check if response.result is null or undefined, and try to use response.data instead
    const tasks = response.result || response.data;
    console.log("Tasks data after processing:", tasks);

    return tasks;
}
export const getLimitedView = async (projectId) => {
    const response = await handleRequest('post', '/projects/get-limited-view', {
        projectId
    });
    console.log("Response from getLimitedView:", response);
    if (response.type !== 'SUCCESS') throw new Error(response.text);

    // Check if response.result is null or undefined, and try to use response.data instead
    const project = response.result || response.data;
    console.log("Project limited data after processing:", project);

    return project;
}
