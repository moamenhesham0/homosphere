import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import { SupabaseProvider } from './context/supabaseContext';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element with id 'root' was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  </StrictMode>,
);
