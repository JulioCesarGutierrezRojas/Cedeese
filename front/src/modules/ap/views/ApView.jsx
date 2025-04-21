import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  markTaskComplete as markTaskCompleteApi,
  getProjectsByEmployee,
  getTaskByProject,
  getLimitedView,
} from '../adapters/controller';
import { showWarningToast } from '../../../kernel/alerts.js';
import Loader from '../../../components/Loader';

const ApView = () => {
  const [projects, setProjects] = useState([]);
  const [tasksByProject, setTasksByProject] = useState({});
  const [limitedViewProjects, setLimitedViewProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('limited'); // 'limited' or 'full'

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const employeeId = localStorage.getItem('id');
        console.log("Employee ID from localStorage:", employeeId);

        // Fetch projects data
        const projectsData = await getProjectsByEmployee(employeeId);
        console.log("Projects data returned from API:", projectsData);

        // Ensure projectsData is an array before setting it
        const projectsArray = Array.isArray(projectsData) ? projectsData : [];
        setProjects(projectsArray);

        // Fetch limited view data for each project
        const limitedData = [];
        for (const project of projectsArray) {
          try {
            const limitedProject = await getLimitedView(project.id);
            console.log(`Limited view for project ${project.id}:`, limitedProject);

            if (limitedProject) {
              limitedData.push(limitedProject);
            }
          } catch (limitedError) {
            console.error(`Error fetching limited view for project ${project.id}:`, limitedError);
          }
        }

        // Update limitedViewProjects state
        setLimitedViewProjects(limitedData);

        // Fetch tasks for each project
        const tasksData = {};
        for (const project of projectsArray) {
          try {
            // Fetch tasks for this project (passing null for phaseId to get all tasks)
            const projectTasks = await getTaskByProject(project.id, null);
            console.log(`Tasks for project ${project.id}:`, projectTasks);

            // Store tasks for this project
            tasksData[project.id] = Array.isArray(projectTasks) ? projectTasks : [];
          } catch (taskError) {
            console.error(`Error fetching tasks for project ${project.id}:`, taskError);
            tasksData[project.id] = [];
          }
        }

        // Update tasksByProject state with all fetched tasks
        setTasksByProject(tasksData);

      } catch (error) {
        showWarningToast({
          title: 'Error al cargar datos',
          text: error?.message || 'Error desconocido'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const markTaskComplete = async (projectId, taskId) => {
    setIsLoading(true);
    try {
      await markTaskCompleteApi(taskId);
      // Actualiza solo esa tarea
      const tasks = tasksByProject[projectId] || [];
      if (Array.isArray(tasks)) {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: true } : task
        );
        setTasksByProject({ ...tasksByProject, [projectId]: updatedTasks });
      }
    } catch (error) {
      showWarningToast({
        title: 'Error al completar tarea',
        text: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle view mode function
  const toggleViewMode = () => {
    setViewMode(viewMode === 'limited' ? 'full' : 'limited');
  };

  return (
      <div className="container mt-5">
        <Loader isLoading={isLoading} />
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-primary">Estado de Proyectos y Tareas</h1>
          <button 
            className="btn btn-outline-primary" 
            onClick={toggleViewMode}
          >
            {viewMode === 'limited' ? 'Ver Vista Completa' : 'Ver Vista Limitada'}
          </button>
        </div>

        {viewMode === 'limited' ? (
          // Limited View - Only shows project name and status
          <div className="row">
            {limitedViewProjects.length === 0 ? (
              <p>No hay proyectos asignados.</p>
            ) : (
              limitedViewProjects.map(project => (
                <div key={project.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{project.name}</h5>
                      <p className="card-text">
                        Estado:{" "}
                        <span
                          className={`badge rounded-pill ${
                            project.estatus === 'COMPLETADO' ? 'bg-success' : 'bg-warning text-dark'
                          }`}
                        >
                          {project.estatus}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Full View - Shows projects with tasks and progress
          projects.length === 0 ? (
            <p>No hay proyectos asignados.</p>
          ) : (
            projects.map(project => {
              const projectTasks = tasksByProject[project.id] || [];
              const total = projectTasks.length;
              const completed = projectTasks.filter(task => task.completed).length;
              const progress = total ? Math.round((completed / total) * 100) : 0;

              return (
                <div key={project.id} className="mb-5">
                  <h3>{project.name}</h3>
                  <p>
                    Estado:{" "}
                    <span
                      className={`badge rounded-pill ${
                        project.estatus === 'COMPLETADO' ? 'bg-success' : 'bg-warning text-dark'
                      }`}
                    >
                      {project.estatus}
                    </span>
                  </p>

                  <h6>Progreso del proyecto: {progress}%</h6>
                  <div className="progress mb-3">
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: `${progress}%` }}
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {progress}%
                    </div>
                  </div>

                  {projectTasks.length === 0 ? (
                    <p>No hay tareas en esta fase.</p>
                  ) : (
                    projectTasks.map(task => (
                      <div key={task.id} className="card mb-2">
                        <div className={`card-body ${task.completed ? 'bg-secondary text-white' : ''}`}>
                          <h5 className="card-title">{task.name}</h5>
                          <p className="card-text"><strong>Fase:</strong> {task.phase?.name || 'No definida'}</p>
                          <p className="card-text">
                            <strong>Estado:</strong> {task.completed ? 'Completada' : 'Pendiente'}
                          </p>
                          {!task.completed && (
                            <button
                              onClick={() => markTaskComplete(project.id, task.id)}
                              className="btn btn-success"
                            >
                              Marcar como completada
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })
          )
        )}
      </div>
  );
};

export default ApView;
