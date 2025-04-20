import {handleRequest} from "../../../config/http-client.gateway.js";

export const getTasks = async () => {
    const response = await handleRequest('get', '/ap/tasks/');

    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    return response.result;
}

export const markTaskComplete = async (taskId) => {
    const response = await handleRequest('post', `/ap/tasks/${taskId}/complete`);

    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    return response.result;
}