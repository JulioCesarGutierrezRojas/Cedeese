import {handleRequest} from "../../../config/http-client.gateway.js";

export const getProjects = async () => {
    const response = await handleRequest('get', '/rape/projects/');

    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    return response.result;
}

export const closeProject = async (projectId) => {
    const response = await handleRequest('put', `/rape/projects/${projectId}/close`);

    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    return response.result;
}