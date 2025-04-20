//tareas asignadas por fase y poderlas marcar como completadas y estado del proyecto.

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ApView = () => {
  const dummyTasks = [
    { id: 1, name: 'Diseñar la interfaz', phase: 'Diseño', completed: false },
    { id: 2, name: 'Implementar autenticación', phase: 'Desarrollo', completed: false },
    { id: 3, name: 'Pruebas unitarias', phase: 'Testing', completed: true },
  ];

  // Estado para las tareas; 
  const [tasks, setTasks] = useState([]);

  // Simulación de carga de datos (aquí se haría el llamado al backend)
  useEffect(() => {
    // /* Aquí iría el llamado al backend para obtener las tareas */
    // Ejemplo: axios.get('/api/tasks').then(response => setTasks(response.data));
    setTasks(dummyTasks);
  }, []);

  // Función para marcar tarea como completada (simulación, sin backend)
  const markTaskComplete = (taskId) => {
    // /* Aquí se llamaría al backend para actualizar el estado de la tarea */
    // axios.post(`/api/tasks/${taskId}/complete`).then(...);
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    ));
  };

  // Calcular el progreso del proyecto basado en las tareas completadas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="container mt-5">
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
