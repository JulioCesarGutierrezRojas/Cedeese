import React from 'react';
import { Spinner } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import '../styles/loader.css';

const Loader = ({ isLoading }) => {
  return (
    <CSSTransition
      in={isLoading}
      timeout={400}
      classNames="fade"
      unmountOnExit
    >
      <div className="loader-overlay">
        <div className="loader-container">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando...</p>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Loader;