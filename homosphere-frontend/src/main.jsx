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
import SubscriptionPage from './pages/SubscriptionPage.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import Profile from './pages/Profile.jsx';
import PropertyListingForm from './pages/PropertyListingForm.jsx';
import AdminPortal from './pages/AdminPortal.jsx';
import SearchPage from './pages/SearchPage.jsx';
import PropertyDetailsPage from './pages/PropertyDetailsPage.jsx';
import RequestViewPage from './pages/RequestViewPage.jsx';

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
                <Route element={<Layout />}>
                    <Route path={ROUTES.HOME} element={<App />} />
                    <Route path="/" element={<App />} />
                    <Route path={ROUTES.SUBSCRIPTION} element={<SubscriptionPage />} />
                    <Route path={ROUTES.PROPERTY_LISTING_FORM} element={<PropertyListingForm />} />
                    <Route path={ROUTES.PROFILE} element={<Profile />} />
                    <Route path={ROUTES.ADMIN_PORTAL} element={<AdminPortal />} />
                    <Route path={ROUTES.SEARCH} element={<SearchPage />} />
                    <Route path="/property/:id" element={<PropertyDetailsPage />} />
                    <Route path={ROUTES.REQUEST_VIEW} element={<RequestViewPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
