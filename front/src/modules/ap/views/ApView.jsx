import React, { useEffect, useState } from 'react';
import { getProjectsByEmployee, getTaskByProject, markTaskCompleted } from '../adapters/controller.js';
import { showWarningToast } from '../../../kernel/alerts.js';
import Loader from '../../../components/Loader.jsx';

const ProjectsAndTasksView = () => {
  const [projects, setProjects] = useState([]);
  const [tasksByProject, setTasksByProject] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const employeeId = localStorage.getItem('id');
        const projectsData = await getProjectsByEmployee(employeeId);
        setProjects(projectsData);

        const allTasks = {};
        for (const project of projectsData) {
          const tasks = await getTaskByProject(project.id, null); // null para traer todas las fases
          allTasks[project.id] = tasks;
        }
        setTasksByProject(allTasks);
      } catch (error) {
        showWarningToast({
          title: 'Error',
          text: error.message || 'Algo salió mal al cargar los datos',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleMarkComplete = async (projectId, taskId) => {
    setIsLoading(true);
    try {
      await markTaskCompleted(taskId);
      const updatedTasks = tasksByProject[projectId].map(task =>
          task.id === taskId ? { ...task, completed: true } : task
      );
      setTasksByProject({ ...tasksByProject, [projectId]: updatedTasks });
    } catch (error) {
      showWarningToast({
        title: 'Error',
        text: error.message || 'No se pudo completar la tarea',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="container mt-5">
        <Loader isLoading={isLoading} />
        <h2 className="mb-4 text-primary">Proyectos y Tareas</h2>

        {/* 📦 CARD de aviso cuando no hay proyectos */}
        {!isLoading && projects.length === 0 && (
            <div className="card border-grey mb-4">
              <div className="card-header bg-primary text-white">Atención</div>
              <div className="card-body">
                <p className="card-text">El empleado no está asignado a ningún proyecto.</p>
              </div>
            </div>
        )}

        {projects.length > 0 &&
            projects.map(project => (
                <div key={project.id} className="mb-4">
                  <h4>{project.name}</h4>
                  <ul className="list-group">
                    {(tasksByProject[project.id] || []).map(task => (
                        <li
                            key={task.id}
                            className={`list-group-item d-flex justify-content-between align-items-center ${
                                task.completed ? 'list-group-item-success' : ''
                            }`}
                        >
                          <div>
                            <strong>{task.name}</strong> – Fase: {task.phase?.name || 'Sin fase'}
                          </div>
                          {!task.completed && (
                              <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleMarkComplete(project.id, task.id)}
                              >
                                Marcar como completada
                              </button>
                          )}
                        </li>
                    ))}
                  </ul>
                </div>
            ))}
      </div>
  );
};

export default ProjectsAndTasksView;
