import React, { useState} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import '../styles/signUpStyle.css';
import { useAuth } from '../contexts/AuthContext';
import { getFieldError, getInputClass } from '../utils/validators';
import { ROUTES } from '../constants/routes';
import FormInput from '../components/FormInput';
import PasswordInput from '../components/PasswordInput';
import GoogleSignInButton from '../components/GoogleSignInButton';
import MessageDisplay from '../components/MessageDisplay';
import { DELAYS } from '@constants/delays.js';
import {
    GENERIC_SIGN_IN_ERROR,
    SIGN_IN_ERRORS_MAP,
    signInErrorMessages,
} from '@constants/signInErrors.js';

const SignIn = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    };

    const setErrorMessage = (message) => {
        setError(message);
        setTimeout(() => setError(''), DELAYS.SIGNIN_ERROR_DELAY);
    };

    const validateFields = () => {
        const emailError = getFieldError('email', formData.email, formData);
        if (emailError) {
            setErrorMessage(emailError);
            return false;
        }

        // const passwordError = getFieldError('password', formData.password, formData);
        // if (passwordError) {
        //     setErrorMessage(passwordError);
        //     return false;
        // }

        return true;
    };

    const signInUserErrorMapping = (error) => {
        const mappedError = SIGN_IN_ERRORS_MAP.find(e => error.message.includes(e.match));
        if (mappedError) {
            setErrorMessage(mappedError.message);
        } else {
            setErrorMessage(GENERIC_SIGN_IN_ERROR);
        }
    }

    const signInUser = async () => {
        try {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                setSuccessMessage('Signed in successfully!');
                return true;
            }
        } catch (error) {
            signInUserErrorMapping(error);
            return false;
        }
    };

    const redirectToProfile = () => {
        setTimeout(() => {
            navigate(ROUTES.HOME);
        }, DELAYS.REDIRECT_DELAY);
    };

    const resetMessages = () => {
        setError('');
        setSuccessMessage('');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        resetMessages();

        if (!validateFields())
            return;

        setIsLoading(true);
        try {
            const success = await signInUser();
            if (success)
                redirectToProfile();
        } catch (error) {
            setErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-center">
            <form className="form" onSubmit={handleSubmit}>
                <p className="title">Sign In</p>
                <p className="message">Sign in now and get full access to our app.</p>
                <MessageDisplay error={error} successMessage={successMessage} />
                <FormInput
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    className={getInputClass('email', formData.email, formData)}
                    label="Email"
                />
                <PasswordInput
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={getInputClass('password', formData.password, formData)}
                    label="Password"
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                />
                <p className="forget-password"><Link to={ROUTES.FORGET_PASSWORD}>Forgot your password?</Link></p>
                <button className="submit" type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Submit'}
                </button>
                <p className="signin">Don't have an account? <Link to={ROUTES.SIGNUP}>Sign up</Link></p>
                <GoogleSignInButton />
            </form>
        </div>
    );
};

export default SignIn;