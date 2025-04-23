import { handleRequest } from "../../../config/http-client.gateway.js";

export const getLogActivities = async () => {
    try {
        const response = await handleRequest("get", "/activities/");
        return response;
    } catch (error) {
        console.error("Error al obtener la bitácora:", error);
        throw error;
    }
};

export const createProject = async (name, identifier, startDate, endDate, employeeId) => {
    try {
        const response = await handleRequest({
            endpoint: "/projects/",
            method: "POST",
            data: {
                name,
                identifier,
                startDate,
                endDate,
                employeeId
            }
        });
        return response;
    } catch (error) {
        console.error("Error al crear el proyecto:", error);
        throw error;
    }
};

export const getProjects = async (employeeId, role) => {
    try {
        const endpoint = role === "ADMIN" 
            ? "/projects/" 
            : `/projects/employee/${employeeId}`;

        const response = await handleRequest({
            endpoint,
            method: "GET",
        });
        return response;
    } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        throw error;
    }
};

export const getPhases = async () => {
    try {
        const response = await handleRequest({
            endpoint: "/phases/",
            method: "GET",
        });
        return response;
    } catch (error) {
        console.error("Error al obtener las fases:", error);
        throw error;
    }
};
