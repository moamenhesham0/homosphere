import PasswordInput  from "@components/PasswordInput";
import '@styles/signUpStyle.css';
import { ROUTES } from "@constants/routes";
import { useNavigate } from "react-router-dom";
import { supabase } from "@utils/supabase";
import { useEffect, useState } from "react";
import { getPasswordResetTokenForEmail, sendResetPasswordForEmail  } from "@services/apiResetPassword";
import FormInput from '@components/FormInput';
import MessageDisplay from '@components/MessageDisplay';
import { PASSWORD_RECOVERY, SIGNED_IN}  from "@constants/events";
import { Link } from "react-router-dom";
import {  getInputClass, getFieldError} from "@utils/validators";


const ForgetPassword = () => {
    /*
    request mode: user provides email to receive reset link
    request_successful mode: email sent confirmation
    reset mode: user provides new password after clicking link in email
     */
    const KEYS = {
        REQUEST : 'request',
        REQUEST_SUCCESSFUL : 'request_successful',
        RESET : 'reset',
        TOKEN_TIME_STAMP : 'token_time_stamp',
    };

    const states = {
        [KEYS.REQUEST]: RequestPasswordReset,
        [KEYS.REQUEST_SUCCESSFUL]: RequestPasswordSuccessful,
        [KEYS.RESET]: ResetPassword,
    };


    const [mode, setMode] = useState(KEYS.REQUEST);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const isTokenValid = () => {
        const TOKEN_VALIDITY_DURATION = 1000 * 60 * 60; // 1 hour
        const currentTime = Date.now();
        const timeStamp = parseInt(sessionStorage.getItem(KEYS.TOKEN_TIME_STAMP), 10);
        return (currentTime - timeStamp) < TOKEN_VALIDITY_DURATION;
    }

    // Check if we're in password recovery mode on mount
    const getInitialMode = async () => {
        const { data: { session } } = await supabase.auth.getSession();


        const requestStatus = sessionStorage.getItem(KEYS.REQUEST);
        const requestSuccessStatus = sessionStorage.getItem(KEYS.REQUEST_SUCCESSFUL);
        const resetStatus = sessionStorage.getItem(KEYS.RESET);


        if (requestSuccessStatus !== null) {
            return KEYS.REQUEST_SUCCESSFUL;
        } else if (resetStatus && isTokenValid()) {
            return KEYS.RESET;
        }

        return KEYS.REQUEST;
    };


    // Initialize mode on component mount
    useEffect(() => {
        getInitialMode().then(initialMode => {
            setMode(initialMode);
        });
    }, []);

    // Listen for auth state changes
    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event:', event);

            if (event === PASSWORD_RECOVERY) {
                sessionStorage.removeItem(KEYS.REQUEST_SUCCESSFUL);
                sessionStorage.setItem(KEYS.TOKEN_TIME_STAMP, Date.now().toString());
                sessionStorage.setItem(KEYS.RESET, 'true');
                setMode(KEYS.RESET);
            }
        });

        return () => listener.subscription.unsubscribe();
    }, []);


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * Wraps async actions with loading to avoid multiple submissions
     */
    const loadingBlocker = (actions) => async (...args) => {
        setIsLoading(true);
        await actions(...args);
        setIsLoading(false);
    }

    /**
     * Validates the email field
     */
    const validateEmail = () => {
        const emailError = getFieldError('email', formData.email, formData);
        if (emailError) {
            setError(emailError);
            return false;
        }
        return true;
    }

    /**
     * Sets the page to show that the password reset request was successful
     */
    const setSuccessfulRequest = () => {
        sessionStorage.removeItem(KEYS.REQUEST);
        sessionStorage.setItem(KEYS.REQUEST_SUCCESSFUL, 'true');
        setMode(KEYS.REQUEST_SUCCESSFUL);
    }

    /**
     * Requests a password reset link to be sent to the user's email
     */
    const requestPasswordReset = loadingBlocker(async () => {
        if(!validateEmail()) {
            return;
        }

        const result = await getPasswordResetTokenForEmail(formData.email);
        if (!result.success) {
            setError(result.error);
        } else {
            setSuccessfulRequest();
        }
    });

    /**
     * Sets the page to show that the password has been reset successfully
     */
    const setSuccessfulReset = () => {
        setSuccessMessage('Password has been reset successfully!');
        sessionStorage.removeItem(KEYS.RESET);
        sessionStorage.removeItem(KEYS.TOKEN_TIME_STAMP);
        sessionStorage.setItem(KEYS.REQUEST, 'true');
        setTimeout(() => {
            navigate(ROUTES.SIGNIN);
        }, 2000);
    }

    /**
     * Validates the password and confirm password fields
     */
    const validatePassword = () => {
        const passwordError = getFieldError('password', formData.password, formData);
        if (passwordError) {
            setError(passwordError);
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        return true;
    }

    /**
     * Resets the user's password using the provided new password
     */
    const resetPassword = loadingBlocker(async () => {
        if(!validatePassword()) {
            return;
        }

        const result = await sendResetPasswordForEmail(formData.password);
        if (!result.success) {
            setError(result.error);
        } else {
            setSuccessfulReset();
        }
    });


    function RequestPasswordReset() {
        return (
            <form className="form" onSubmit={(e) => { e.preventDefault(); requestPasswordReset(); }}>
                <p className="title">Request Password Reset</p>
                <p className="message">Enter your email address</p>

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

                <p className="forget-password"><Link to={ROUTES.SIGNIN}>Return to sign in</Link></p>

                <button className="submit" type="submit" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Reset Password'}
                </button>
            </form>
        );
    }

    function RequestPasswordSuccessful() {
        return (
            <form className="form" >
                <p className="title">Request Password Reset</p>
                <p className="message">An email has been sent with instructions to reset your password.</p>
            </form>
        );
    }

    function ResetPassword() {
        return (
            <form className="form" onSubmit={(e) => { e.preventDefault(); resetPassword(); }}>
                <p className="title">Reset Password</p>
                <p className="message">Please enter your new password below.</p>

                <MessageDisplay error={error} successMessage={successMessage} />

                <PasswordInput
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={getInputClass('password', formData.password, formData)}
                    label="New Password"
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                />

                <PasswordInput
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={getInputClass('confirmPassword', formData.confirmPassword, formData)}
                    label="Confirm New Password"
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                />

                <button className="submit" type="submit" disabled={isLoading}>
                    {'Set New Password'}
                </button>
            </form>
        );
    }


    return (
        <>
            {states[mode]()}
        </>
    );
}

export default ForgetPassword;