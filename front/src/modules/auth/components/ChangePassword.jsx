import React, { useState } from 'react';
import styles from '../../../styles/form-login.module.css';
import { useNavigate } from 'react-router';
import Loader from '../../../components/Loader.jsx';
import { showSuccessToast, showWarningToast } from '../../../kernel/alerts.js';
import { changePassword } from '../controller/controller.js';
import { validatePassword } from '../../../kernel/validations.js';

const ChangePassword = ({ email, token, setStep, user }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
            const response = await changePassword(user, newPassword, confirmPassword);
            showSuccessToast({ title: 'Éxito', text: response.message });
            navigate('/');
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

                <button type="submit" className={styles.submitButton}>
                    Cambiar contraseña
                </button>
            </form>
        </>
    );
};

export default ChangePassword;
