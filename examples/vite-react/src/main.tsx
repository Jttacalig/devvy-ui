import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@devvy-ui/tokens/theme.css';
import '@devvy-ui/styles';
import './style.css';
import { App } from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root');
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
