import React, { useState } from 'react';
import styles from '../../../styles/form-login.module.css';
import Loader from '../../../components/Loader.jsx';
import { showSuccessToast, showWarningToast } from '../../../kernel/alerts.js';
import { verifyToken } from '../controller/controller.js'; // si vas a manejar el reenvío

const ValidateToken = ({ email, token, setToken, setStep, setUser }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await verifyToken(token);
            setUser(response.data); // Guarda info del usuario
            showSuccessToast({ title: 'Éxito', text: response.message });
            setStep(3); // Avanza a ChangePassword
        } catch (error) {
            showWarningToast({ title: 'Error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsLoading(true);
        try {
            const response = await resendToken(email);
            showSuccessToast({ title: 'Código reenviado', text: response });
        } catch (error) {
            showWarningToast({ title: 'Error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Loader isLoading={isLoading} />
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
