import {useEffect, useState} from "react";
import {FileText, Folder, LogOut, PieChart, Users} from "react-feather";
import '../styles/sidebar.css';
import logo from '../assets/logo-cds.jpg'
import { useNavigate } from "react-router";

const Sidebar = ({ role }) => {
    const [user, setUser] = useState()
    const navigate = useNavigate();

    useEffect(() => {
        const name = localStorage.getItem('user') || 'Usuario'
        setUser(name)
    }, []);

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('user')
        navigate('/');

    }

    return (
        <div className="sidebar-container bg-primary col-md-2 fixed-top min-vh-100 d-flex flex-column">
            <div className="sidebar-header p-3">
                <div className="d-flex flex-column align-items-center gap-3">
                    <div className="w-100 px-4 mb-1">
                        <img
                            src={ logo }
                            alt=""
                            className="img-logo img-fluid w-100"
                        />
                    </div>
                    <div className="text-center text-white">
                        <p className="m-0">Centro de Desarrollo de Software</p>
                    </div>
                </div>
            </div>
            <div className="p-2 border-top border-bottom border-secondary">
                <small className="my-3 text-white">{ user }</small>
            </div>
            <nav className="flex-grow-1 p-4">
                <ul className="nav flex-column gap-2">
                    { role === 'MASTER' && (
                        <>
                            <li className="nav-item">
                                <a href="/" className="nav-link text-white d-flex align-items-center gap-3 hover-item">
                                    <Users size={20}/>
                                    <span>Empleados</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/" className="nav-link text-white d-flex align-items-center gap-3 hover-item">
                                    <Folder size={20}/>
                                    <span>Proyectos</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/" className="nav-link text-white d-flex align-items-center gap-3 hover-item">
                                    <PieChart size={20}/>
                                    <span>Fases</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/" className="nav-link text-white d-flex align-items-center gap-3 hover-item">
                                    <FileText size={20}/>
                                    <span>Tareas</span>
                                </a>
                            </li>
                        </>
                    )}
                    { role === 'RAPE' && (
                        <>
                            <li className="nav-item">
                                <a href="/" className="nav-link text-white d-flex align-items-center gap-3 hover-item">
                                    <Folder size={20}/>
                                    <span>Proyecto</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/" className="nav-link text-white d-flex align-items-center gap-3 hover-item">
                                    <PieChart size={20}/>
                                    <span>Fases</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/" className="nav-link text-white d-flex align-items-center gap-3 hover-item">
                                    <FileText size={20}/>
                                    <span>Tareas</span>
                                </a>
                            </li>
                        </>
                    )}
                    { role === 'RD' && (
                        <>
                            <li className="nav-item">
                                <a href="/" className="nav-link text-white d-flex align-items-center gap-3 hover-item">
                                    <PieChart size={20}/>
                                    <span>Fases</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/rd" className="nav-link text-white d-flex align-items-center gap-3 hover-item">
                                    <FileText size={20}/>
                                    <span>Tareas</span>
                                </a>
                            </li>
                        </>
                    )}
                    { role === 'AP' && (
                        <>
                            <li className="nav-item">
                                <a href="/" className="nav-link text-white d-flex align-items-center gap-3 hover-item">
                                    <Folder size={20}/>
                                    <span>Estado Proyecto</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="/" className="nav-link text-white d-flex align-items-center gap-3 hover-item">
                                    <FileText size={20}/>
                                    <span>Tareas Asignada</span>
                                </a>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            <div className="p-2 mx-4 border-top border-secondary">
                <a onClick={ logout } className="nav-link text-white d-flex align-items-center gap-3 hover-item">
                    <LogOut size={20}/>
                    <span>Cerrar Sesión</span>
                </a>
            </div>
        </div>
    )
};

export default Sidebar;