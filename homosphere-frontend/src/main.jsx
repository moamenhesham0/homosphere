import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import './index.css';
import App from './App.jsx';
import SignUp from './pages/signUpPage.jsx';
import SignIn from './pages/signInPage.jsx';
import SubscriptionPage from './pages/SubscriptionPage.jsx';
import AuthCallback from './pages/AuthCallback.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
        </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
