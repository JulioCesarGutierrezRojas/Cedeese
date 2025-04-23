import { handleRequest } from "../../../config/http-client.gateway.js";

export const getLogActivities = async () => {
    try {
        const response = await handleRequest("get", "/activities/");
        console.log(response);
        return response;
    } catch (error) {
        console.error("Error al obtener la bitácora:", error);
        throw error;
    }
};