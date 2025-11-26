import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import SignUp from './pages/signUpPage.jsx';
import SignIn from './pages/signInPage.jsx';
import BuyerSubscriptionPage from './pages/BuyerSubscriptionPage.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/buyer-subscription" element={<BuyerSubscriptionPage />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
