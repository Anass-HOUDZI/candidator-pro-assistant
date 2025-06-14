
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  // Fallback en cas d'erreur critique
  container.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: system-ui;">
      <h1>Erreur de chargement</h1>
      <p>Une erreur s'est produite lors du chargement de l'application.</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; background: #3B82F6; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Recharger la page
      </button>
    </div>
  `;
}
