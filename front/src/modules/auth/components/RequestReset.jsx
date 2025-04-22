import React from 'react';
import styles from '../../../styles/form-login.module.css';
import { showSuccessToast, showWarningToast } from '../../../kernel/alerts.js';
import { sendEmail } from '../controller/controller.js';

const RequestReset = ({ email, setEmail, setStep, isLoading, setIsLoading }) => {

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await sendEmail(email);
            showSuccessToast({ title: 'Éxito', text: response || 'Código enviado correctamente' });
            setStep(2); // Sigue a validateTopken
        } catch (error) {
            showWarningToast({ title: 'Error', text: error?.message || 'Error desconocido al enviar el correo' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        placeholder="tucorreo@ejemplo.com"
                        required
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    Enviar código de verificación
                </button>
            </form>
        </>
    );
};

export default RequestReset;
