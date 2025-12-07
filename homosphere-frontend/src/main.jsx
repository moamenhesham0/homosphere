import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import './index.css';
import App from './App.jsx';
import { ROUTES } from './constants/routes.js';
import ForgetPassword from './pages/forgetPasswordPage';
import AuthPage from './pages/authPage.jsx';
import SignUp from './pages/signUpPage.jsx';
import SignIn from './pages/signInPage.jsx';
import Layout from './components/Layout.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import SubscriptionPage from './pages/SubscriptionPage.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import Profile from './pages/Profile.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path={ROUTES.SIGNUP} element={<SignUp />} />
                <Route path={ROUTES.SIGNIN} element={<SignIn />} />
                <Route path={ROUTES.FORGET_PASSWORD} element={<ForgetPassword />} />
                <Route path={ROUTES.AUTH} element={<AuthPage />} />
                <Route path={ROUTES.HOME} element={<App />} />
                <Route path={ROUTES.SUBSCRIPTION} element={<SubscriptionPage />} />
                <Route path={ROUTES.PROFILE} element={<Profile />} />
            </Routes>
        </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
