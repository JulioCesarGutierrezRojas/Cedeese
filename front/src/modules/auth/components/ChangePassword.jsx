import React, { useState } from 'react';
import styles from '../../../styles/form-login.module.css';
import { useNavigate } from 'react-router';
import { showSuccessToast, showWarningToast } from '../../../kernel/alerts.js';
import { changePassword } from '../controller/controller.js';
import { validatePassword } from '../../../kernel/validations.js';

const ChangePassword = ({ email, token, setStep, user, isLoading, setIsLoading }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const passwordError = validatePassword(newPassword);

        if (!passwordError) {
            showWarningToast({
                title: 'Contraseña inválida',
                text: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número, un carácter especial y sin espacios.'
            });
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            showWarningToast({
                title: 'Las contraseñas no coinciden',
                text: 'Asegúrate de que ambas contraseñas sean iguales.'
            });
            setIsLoading(false);
            return;
        }

        try {
            // Pass user object with email as fallback
            const response = await changePassword(user || { email }, token, newPassword, confirmPassword);
            showSuccessToast({ title: 'Éxito', text: response?.message || 'Contraseña cambiada correctamente' });
            await navigate('/');
        } catch (error) {
            showWarningToast({ title: 'Error', text: error?.message || 'Error desconocido al cambiar la contraseña' });
            // If there's an error, allow going back to the previous step
            setStep(2);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 text-center">
                    <p className="text-muted">
                        Cambiando contraseña para <span className="fw-bold" style={{ color: 'var(--tomato)' }}>{email}</span>
                    </p>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="newPassword" className={styles.label}>Nueva contraseña</label>
                    <div className={styles.passwordInputGroup}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={styles.input}
                            placeholder="Ingresa tu nueva contraseña"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={styles.passwordToggle}
                        >
                            {showPassword ? (
                                <i className="bi bi-eye-slash"></i>
                            ) : (
                                <i className="bi bi-eye"></i>
                            )}
                        </button>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword" className={styles.label}>Confirmar contraseña</label>
                    <div className={styles.passwordInputGroup}>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.input}
                            placeholder="Confirma tu nueva contraseña"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={styles.passwordToggle}
                        >
                            {showConfirmPassword ? (
                                <i className="bi bi-eye-slash"></i>
                            ) : (
                                <i className="bi bi-eye"></i>
                            )}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={isLoading}
                >
                    {isLoading ? 'Cambiando...' : 'Cambiar contraseña'}
                </button>

                <div className="text-center mt-3">
                    <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => setStep(2)}
                        disabled={isLoading}
                        style={{ color: 'var(--tomato)', fontSize: '0.9rem' }}
                    >
                        <i className="bi bi-arrow-left me-2"></i>Volver al paso anterior
                    </button>
                </div>
            </form>
        </>
    );
};

export default ChangePassword;
