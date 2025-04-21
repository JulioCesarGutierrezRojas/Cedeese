//tareas asignadas por fase y poderlas marcar como completadas y estado del proyecto.

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getTasks, markTaskComplete as markTaskCompleteApi } from '../adapters/controller';
import { showWarningToast } from '../../../kernel/alerts.js';
import Loader from '../../../components/Loader';
import ErrorBoundary from '../../../components/ErrorBoundary';

const ApView = () => {
  // Estado para las tareas
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar tareas desde el backend
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch (error) {
        showWarningToast({ 
          title: 'Error al cargar tareas', 
          text: error?.message || 'Error desconocido al cargar tareas'
        });
        // Fallback a datos de ejemplo si hay error
        setTasks([
          { id: 1, name: 'Diseñar la interfaz', phase: 'Diseño', completed: false },
          { id: 2, name: 'Implementar autenticación', phase: 'Desarrollo', completed: false },
          { id: 3, name: 'Pruebas unitarias', phase: 'Testing', completed: true },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Función para marcar tarea como completada
  const markTaskComplete = async (taskId) => {
    setIsLoading(true);
    try {
      await markTaskCompleteApi(taskId);
      // Actualizar el estado local después de la actualización exitosa
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      ));
    } catch (error) {
      showWarningToast({ 
        title: 'Error al actualizar tarea', 
        text: error?.message || 'Error desconocido al actualizar tarea'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular el progreso del proyecto basado en las tareas completadas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="container mt-5">
      <ErrorBoundary>
        <Loader isLoading={isLoading} />
      </ErrorBoundary>
      <h1 className="text-primary mb-4">Estado del Proyecto</h1>

      {/* Barra de progreso */}
      <div className="mb-4">
        <h5>Progreso: {progress}%</h5>
        <div className="progress">
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
      </div>

      {/* Listado de tareas */}
      <h1>Tareas asignadas</h1>
      {tasks.map(task => (
        <div key={task.id} className="card mb-3">
          <div className={`card-body ${task.completed ? 'bg-secondary text-white' : ''}`}>
            <h5 className="card-title">{task.name}</h5>
            <p className="card-text"><strong>Fase:</strong> {task.phase}</p>
            <p className="card-text">
              <strong>Estado:</strong> {task.completed ? 'Completada' : 'Pendiente'}
            </p>
            {/* Botón para marcar como completada (solo se muestra si la tarea no está completada) */}
            {!task.completed && (
              <button
                onClick={() => markTaskComplete(task.id)}
                className="btn btn-primary"
              >
                Marcar como completada
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApView;
