import handleRequest from "../../../config/http-client.gateway";

const Controller = async ({ email, password }) => {
    try {
        const response = await handleRequest({
            method: "POST",
            url: "/auth/login", // Asegúrate que coincide con tu endpoint en Spring
            data: { email, password },
        });

        const { token } = response;
        localStorage.setItem("token", token);

        return {
            success: true,
            token,
        };
    } catch (error) {
        console.error("Error en loginController:", error);

        return {
            success: false,
            message: error?.response?.data?.general || "Error al iniciar sesión",
        };
    }
};

export const signIn = async (email, password) => {
    return Controller({ email, password });
};

export const requestPasswordReset = async (email) => {
    try {
        const response = await handleRequest({
            method: "POST",
            url: "/auth/request-password-reset",
            data: { email },
        });

        return {
            success: true,
            message: "Se ha enviado un correo con instrucciones para restablecer tu contraseña.",
        };
    } catch (error) {
        console.error("Error en requestPasswordReset:", error);

        return {
            success: false,
            message: error?.response?.data?.general || "Error al solicitar el restablecimiento de contraseña",
        };
    }
};

export const validateResetToken = async (token) => {
    try {
        const response = await handleRequest({
            method: "POST",
            url: "/auth/validate-reset-token",
            data: { token },
        });

        return {
            success: true,
            message: "Token válido",
        };
    } catch (error) {
        console.error("Error en validateResetToken:", error);

        return {
            success: false,
            message: error?.response?.data?.general || "Token inválido o expirado",
        };
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await handleRequest({
            method: "POST",
            url: "/auth/reset-password",
            data: { token, newPassword },
        });

        return {
            success: true,
            message: "Contraseña restablecida correctamente",
        };
    } catch (error) {
        console.error("Error en resetPassword:", error);

        return {
            success: false,
            message: error?.response?.data?.general || "Error al restablecer la contraseña",
        };
    }
};

export const sendEmail = async (email) => {
    try {
        const response = await requestPasswordReset(email);
        return response.message;
    } catch (error) {
        throw new Error(error.message || "Error al enviar el correo de recuperación");
    }
};

export const verifyToken = async (token) => {
    try {
        const response = await validateResetToken(token);
        return {
            success: true,
            message: "Token verificado correctamente",
            data: { token } // Simulamos datos del usuario para mantener la interfaz
        };
    } catch (error) {
        throw new Error(error.message || "Error al verificar el token");
    }
};

export const resendToken = async (email) => {
    try {
        await requestPasswordReset(email);
        return "Se ha reenviado el código de verificación a tu correo";
    } catch (error) {
        throw new Error(error.message || "Error al reenviar el código");
    }
};

export const changePassword = async (user, newPassword, confirmPassword) => {
    try {
        if (newPassword !== confirmPassword) {
            throw new Error("Las contraseñas no coinciden");
        }

        const response = await resetPassword(user.token, newPassword);
        return {
            success: true,
            message: "Contraseña cambiada correctamente"
        };
    } catch (error) {
        throw new Error(error.message || "Error al cambiar la contraseña");
    }
};

export default Controller;
