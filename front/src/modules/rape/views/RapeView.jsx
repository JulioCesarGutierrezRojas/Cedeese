import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const RapeView = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      nombre: "Sistema de Gestión",
      identificador: "SISA",
      faseActual: "Ejecución",
      estado: "En progreso"
    },
    {
      id: 2,
      nombre: "Plataforma Web",
      identificador: "WEBX",
      faseActual: "Planeación",
      estado: "En progreso"
    },
    {
      id: 3,
      nombre: "Aplicación Móvil",
      identificador: "APPDEV",
      faseActual: "Cierre",
      estado: "Cerrado"
    }
  ]);
  
  //const [projects, setProjects] = useState([]);

  /*useEffect(() => {
    axios
      .get("")
      .then((response) => setProjects(response.data))
      .catch((error) => console.error("Error cargando proyectos:", error));
  }, []);

  const cerrarProyecto = async (id) => {
    try {
      await axios.put(`http://tu-api.com/proyectos/${id}/cerrar`);
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === id ? { ...proj, estado: "Cerrado" } : proj
        )
      );
    } catch (error) {
      console.error("Error cerrando proyecto:", error);
    }
  };*/

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary">Gestión de Proyectos</h2>
      <div className="table-responsive">
        <table className="table table-hover shadow-sm rounded overflow-hidden">
          <thead className="table-primary border-0">
            <tr className="text-secondary text-center">
              <th>Nombre</th>
              <th>Identificador</th>
              <th>Fase Actual</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="align-middle text-center">
                <td>{project.nombre}</td>
                <td>{project.identificador}</td>
                <td>{project.faseActual}</td>
                <td>
                  <span 
                    className={`badge ${
                      project.estado === "Cerrado" ? "bg-danger" : "bg-success"
                    }`}
                  >
                    {project.estado}
                  </span>
                </td>
                <td>
                  {project.estado !== "Cerrado" && (
                    <button
                      className="btn btn-danger btn-sm shadow-sm"
                      onClick={() => cerrarProyecto(project.id)}
                    >
                      Cerrar Proyecto
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RapeView;
