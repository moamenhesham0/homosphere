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
        setTimeout(() => setError(''), 3000);
    };

    const validateFields = () => {
        const emailError = getFieldError('email', formData.email, formData);
        if (emailError) {
            setErrorMessage(emailError);
            return false;
        }

        const passwordError = getFieldError('password', formData.password, formData);
        if (passwordError) {
            setErrorMessage(passwordError);
            return false;
        }

        return true;
    };

    const signInUser = async () => {
        try {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                setSuccessMessage('Signed in successfully!');
                return true;
            }
        } catch (error) {
            if (error.message.includes('Invalid login credentials')) {
                setErrorMessage('Invalid email or password');
            } else if (error.message.includes('Email not confirmed')) {
                setErrorMessage('Please verify your email before signing in');
            } else if (error.message.includes('complete your profile')) {
                setErrorMessage('Please complete signup process');
            } else {
                setErrorMessage(error.message || 'Sign in failed');
            }
            return false;
        }
    };

    const redirectToProfile = () => {
        setTimeout(() => {
            navigate(ROUTES.PROFILE);
        }, 1000);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!validateFields()) {
            return;
        }

        setIsLoading(true);
        try {
            const success = await signInUser();
            if (success) {
                
                redirectToProfile();
            }
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