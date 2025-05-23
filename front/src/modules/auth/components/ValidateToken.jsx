import React from 'react';
import styles from '../../../styles/form-login.module.css';
import { showSuccessToast, showWarningToast } from '../../../kernel/alerts.js';
import { verifyToken, sendEmail } from '../controller/controller.js';

const ValidateToken = ({ email, token, setToken, setStep, setUser, isLoading, setIsLoading }) => {

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await verifyToken(token, email);
            setUser(response); // Guarda info del usuario
            showSuccessToast({ title: 'Éxito', text: response?.message || 'Código verificado correctamente' });
            setStep(3); // Avanza a ChangePassword
        } catch (error) {
            showWarningToast({ title: 'Error', text: error?.message || 'Error desconocido al verificar el código' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsLoading(true);
        try {
            const response = await sendEmail(email);
            showSuccessToast({ title: 'Código reenviado', text: response || 'Código reenviado correctamente' });
        } catch (error) {
            showWarningToast({ title: 'Error', text: error?.message || 'Error desconocido al reenviar el código' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 text-center">
                    <p className="text-muted">
                        Hemos enviado un código de 5 dígitos a <span className="fw-bold" style={{ color: 'var(--tomato)' }}>{email}</span>
                    </p>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="token" className={styles.label}>Código de verificación</label>
                    <input
                        type="text"
                        id="token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className={`${styles.input} text-center fw-bold`}
                        placeholder="_____"
                        maxLength="5"
                        required
                        style={{ letterSpacing: '5px', fontSize: '1.2rem' }}
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    Verificar código
                </button>

                <div className="text-center mt-3">
                    <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={handleResend}
                        style={{ color: 'var(--tomato)', fontSize: '0.9rem' }}
                    >
                        <i className="bi bi-arrow-repeat me-2"></i>Reenviar código
                    </button>
                </div>
            </form>
        </>
    );
};

export default ValidateToken;
