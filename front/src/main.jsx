import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import AppRouter from './router/router'
import './styles.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <AppRouter />
      </BrowserRouter>
  </StrictMode>
)