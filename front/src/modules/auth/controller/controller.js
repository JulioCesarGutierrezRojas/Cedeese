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
    const response = await handleRequest('post', '/auth/recover-password', { email })

    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    return response.result?.message || 'Código enviado correctamente';
}

export const verifyToken = async (token, email) => {
    const response = await handleRequest('post', '/auth/verify-token', { token, email })

    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    return response.result || { message: 'Código verificado correctamente' };
}

export const changePassword = async (user, token, password, confirmPassword) => {
    // Ensure all required parameters are included in the request
    const payload = {
        userId: user.id || user.userId,
        email: user.email,
        token,
        password,
        confirmPassword
    };
    const response = await handleRequest('post', '/auth/change-password', payload)

    if (response.type !== 'SUCCESS')
        throw new Error(response.text);

    return response.result || { message: 'Contraseña cambiada correctamente' };
}
