import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import './index.css'
import router from './routes';
import SharedState from './context/sharedState';
import { cleanupStalePaymentData, cleanupStaleSessionData } from './utils/cleanupStorage';

// Auto-cleanup stale data on app startup
cleanupStalePaymentData();
cleanupStaleSessionData();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SharedState>
      <RouterProvider router={router} />
    </SharedState>
  </StrictMode>,
)
