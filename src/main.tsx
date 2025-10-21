import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

import AuthManager from "./authManager";

const renderApp = () => {
  const container = document.getElementById("root");
  if (!container) {
	throw new Error('Root container "root" not found');
  }
  createRoot(container).render(<App />);
};

AuthManager.initKeycloak(renderApp);
