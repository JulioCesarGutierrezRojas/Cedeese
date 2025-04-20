import React, { useState } from 'react';
import { Link } from 'react-router';
import RequestReset from '../components/RequestReset';
import ValidateToken from '../components/ValidateToken';
import ChangePassword from '../components/ChangePassword';
import styles from '../../../styles/form-login.module.css';
import logo from '../../../assets/logo-cds.jpg';

const RecoverPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoWrapper}>
                        <img src={logo} className={styles.logo} alt="Logo CDS" />
                    </div>
                    <h1 className={styles.appName}>Gestión de Proyectos CDS</h1>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.form} style={{ maxWidth: '450px' }}>
                    <h2 className={styles.title}>Restablecer Contraseña</h2>
                    <p className={styles.subtitle}>
                        {step === 1 && 'Ingresa tu correo para comenzar'}
                        {step === 2 && 'Verifica tu identidad'}
                        {step === 3 && 'Crea una nueva contraseña'}
                    </p>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '2rem',
                        gap: '0.5rem'
                    }}>
                        {[1, 2, 3].map((stepNumber) => (
                            <React.Fragment key={stepNumber}>
                                <div style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    backgroundColor: step >= stepNumber ? 'var(--tomato)' : 'var(--blue)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.9rem',
                                    fontWeight: '600'
                                }}>
                                    {stepNumber}
                                </div>
                                {stepNumber < 3 && (
                                    <div style={{
                                        width: '30px',
                                        height: '2px',
                                        backgroundColor: step > stepNumber ? 'var(--tomato)' : 'var(--blue)'
                                    }}></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {step === 1 && <RequestReset email={email} setEmail={setEmail} setStep={setStep} />}
                    {step === 2 && <ValidateToken email={email} token={token} setToken={setToken} setStep={setStep} setUser={setUser} />}
                    {step === 3 && <ChangePassword email={email} token={token} setStep={setStep} user={user} />}

                    <div style={{
                        marginTop: '1.5rem',
                        textAlign: 'center',
                        borderTop: '1px solid #eee',
                        paddingTop: '1.5rem'
                    }}>
                        <Link to="/" className={styles.link}>
                            <i className="bi bi-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecoverPassword;
