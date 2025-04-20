import {handleRequest} from "../../../config/http-client.gateway.js";

export const signIn = async (email, password) => {
    const response = await handleRequest('post', '/auth/signin', { email, password });
    console.log("se esta imprimiendo: " , response);

    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    const {token, role} = response.result;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    return true;
}

export const sendEmail = async (email) => {
    const response = await handleRequest('post', '/auth/recover-password/', { email })

    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    return response.result.message;
}

export const verifyToken = async (token) => {
    const response = await handleRequest('post', '/auth/verify-token/', { token })

    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    return response.result;
}

export const changePassword = async (user,  new_password, confirm_password) => {
    const response = await handleRequest('post', '/auth/change-password/', { user, new_password, confirm_password })

    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    return response.result;
}