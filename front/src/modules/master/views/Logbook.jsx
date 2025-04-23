import React, { useEffect, useState } from 'react';
import { getLogActivities } from "../adapters/controllerLogbook.js";
import Error404 from '../../../components/error404.jsx';

const Logbook = () => {
    const [logs, setLogs] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const logsPerPage = 15;

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await getLogActivities();
            if (!response || !response.result) {
                throw new Error("Sin resultados válidos");
            }
            setLogs(response.result);
            setHasError(false);
        } catch (error) {
            console.error("Error al obtener logs:", error);
            setHasError(true);
        }
    };

    if (hasError) {
        return <Error404 />;
    }

    const filteredLogs = logs.filter(log =>
        log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.httpMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

    // Generador de páginas con un rango visible de máximo 5
    const getPageNumbers = () => {
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = start + maxVisible - 1;

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxVisible + 1);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Bitácora de Actividades</h1>

            <div className="row mb-3">
                <div className="col-md-12">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por usuario, método o endpoint"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            <table className="table table-striped table-bordered">
                <thead className="table-light">
                <tr>
                    <th>Método</th>
                    <th>Usuario</th>
                    <th>Endpoint</th>
                    <th>Fecha</th>
                </tr>
                </thead>
                <tbody>
                {currentLogs.map((log, index) => (
                    <tr key={index}>
                        <td>{log.httpMethod}</td>
                        <td>{log.username}</td>
                        <td>{log.endpoint}</td>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                ))}
                {currentLogs.length === 0 && (
                    <tr>
                        <td colSpan="4" className="text-center">No se encontraron resultados</td>
                    </tr>
                )}
                </tbody>
            </table>

            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>&laquo;</button>
                    </li>
                    {getPageNumbers().map((number) => (
                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(number)}>{number}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>&raquo;</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Logbook;
