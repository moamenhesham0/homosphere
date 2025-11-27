import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { ROUTES } from '@constants/routes.js';
import SignUp from '@pages/signUpPage.jsx';
import SignIn from '@pages/signInPage.jsx';
import ForgetPassword from '@pages/forgetPasswordPage';
import AuthPage from '@pages/authPage.jsx';
import SignUp from './pages/signUpPage.jsx';
import SignIn from './pages/signInPage.jsx';
import SubscriptionPage from './pages/SubscriptionPage.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path={ROUTES.HOME} element={<App />} />
                <Route path={ROUTES.SIGNUP} element={<SignUp />} />
                <Route path={ROUTES.SIGNIN} element={<SignIn />} />
                <Route path={ROUTES.FORGET_PASSWORD} element={<ForgetPassword />} />
                <Route path={ROUTES.AUTH} element={<AuthPage />} />
                <Route path="/" element={<App />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
