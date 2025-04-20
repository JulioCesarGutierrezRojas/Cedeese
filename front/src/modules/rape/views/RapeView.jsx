import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { showAlert, showConfirmation } from "../../../kernel/alerts.js";

const RapeView = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
    },
    {id: 4,
      nombre: "Gestión de Proyectos",
      identificador: "APPDEV",
      faseActual: "Cierre",
      estado: "Cerrado"
    },
    {id: 5,
      nombre: "Sistema de Carnicería",
      identificador: "SISA",
      faseActual: "Ejecución",
      estado: "En progreso"
    },
    {id: 6,
      nombre: "Aplicación Móvil",
      identificador: "APPDEV",
      faseActual: "Cierre",
      estado: "Cerrado"
    },
  ]);

  /*useEffect(() => {
    axios
      .get("http://tu-api.com/proyectos")
      .then((response) => setProjects(response.data))
      .catch((error) => console.error("Error cargando proyectos:", error));
  }, []);*/

  const filteredProjects = projects.filter(
    (project) =>
      project.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary fw-bold mb-5 mt-5">
        Gestión de Proyectos
      </h1>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre o estado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="row">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className="col-md-4 mb-5 d-flex">
              <div className="card shadow rounded-3 w-100 border-1">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h4 className="card-title text-center text-primary fw-semibold">
                      {project.nombre}
                    </h4>
                    <h6 className="card-subtitle mt-4 text-muted text-center mb-4">
                      ID: {project.identificador}
                    </h6>
                    <p className="card-text mt-3 text-center mb-4">
                      <strong>Fase actual:</strong> {project.faseActual} <br />{" "}
                      <br />
                      <strong>Estado:</strong> {project.estado}
                    </p>
                  </div>

                  {project.estado !== "Cerrado" && (
                    <button
                      className="btn btn-primary btn-sm mt-3 align-self-end"
                      onClick={() => {
                        showConfirmation(
                          "Cerrar proyecto",
                          "¿Estás seguro de cerrar este proyecto?",
                          "warning",
                          "Sí, cerrar proyecto",
                          "Cancelar",
                        ).then((result) => {
                          if (result.isConfirmed) {
                            cerrarProyecto(project.id);
                          }
                        });
                      }}
                    >
                      Cerrar Proyecto
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-5">
            <h5 className="text-muted">No se encontraron resultados</h5>
          </div>
        )}
      </div>
    </div>
  );
} 

export default RapeView;
