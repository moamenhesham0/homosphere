import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import '../styles/signUpStyle.css';
import { signUpWithEmail } from '../services/apiSignUp';

const SignUp = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const strongPasswordValidation = (password) => {
    const passwordFormat = /^(?=(?:.*\d){2,})(?=.*[^a-zA-Z0-9]).{8,}$/;
    return passwordFormat.test(password);
  };

  const emailFormatValidation = (email) => {
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailFormat.test(email);
  };

  const getFieldError = (fieldName, value, currentFormData) => {
    switch(fieldName) {
      case 'firstname':
      case 'lastname':
        if (!value || value.trim() === "" || value.startsWith(" ")) {
          return `Invalid : Empty ${fieldName} input or starts with space`;
        }
        return null;
      
      case 'email':
        if (!value || value.trim() === "") {
          return 'Invalid : Empty email input';
        }
        if (!emailFormatValidation(value)) {
          return 'Invalid email format';
        }
        return null;
      
      case 'password':
        if (!strongPasswordValidation(value)) {
          return 'Password must be at least 8 characters long and contain at least two numbers, one 1 special character';
        }
        return null;
      
      case 'confirmPassword':
        if (value !== currentFormData.password) {
          return 'Passwords don\'t match';
        }
        if (!value) { 
            return "Confirm password required";
        }
        return null;
        
      case 'role':
        if (value === "") {
          return 'Please select a role';
        }
        return null;
      
      case 'agreedToTerms':
        if (!value) {
          return 'You must agree to the Terms & Conditions';
        }
        return null;
      
      default:
        return null;
    }
  };

  const getInputClass = (name) => {
    const error = getFieldError(name, formData[name], formData);
    return error ? "input input-error" : "input input-success";
  };

  const setErrorMessage = (message)=> {
    setError(message);
    setTimeout(()=> setError('') , 4000);
  }; 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate all fields
    const fieldsToCheck = [
        'firstname', 'lastname', 'email', 'password', 'confirmPassword', 'role'
    ];

    for (const fieldName of fieldsToCheck) {
        const errorMsg = getFieldError(fieldName, formData[fieldName], formData);
        if (errorMsg) {
            setErrorMessage(errorMsg);
            return;
        }
    }

    if (!agreedToTerms) {
        setErrorMessage("You must agree to the Terms & Conditions");
        return;
    }
    
    // Sign up with Supabase
    setIsLoading(true);
    try {
      const result = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.firstname,
        formData.lastname,
        formData.role
      );

      if (result.success) {
        setSuccessMessage(result.message);
        // Clear form
        setFormData({
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: '',
        });
        setAgreedToTerms(false);

        setTimeout(() => { // timeout to show success message before redirect
          navigate('/signin');
        }, 5000);
      } else {
        setErrorMessage(result.error);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
    <p className="title">Register</p>
    <p className="message">Signup now and get full access to our app.</p>
    {error && <p className="error-message">{error}</p>}
    {successMessage && <p className="success-message">{successMessage}</p>}
    <div className="flex">
    <div>
    <label>
    <input 
        required
        name="firstname"
        value={formData.firstname} 
        onChange={handleInputChange}
        type="text" 
        className={getInputClass('firstname')} 
    />
    <span>Firstname</span>
    </label>
    </div>
    <div>
    <label>
    <input 
        required
        name="lastname"
        value={formData.lastname} 
        onChange={handleInputChange}
        type="text" 
        className={getInputClass('lastname')} 
    />
    <span>Lastname</span>
    </label>
    </div>
    </div>

    <label>
        <input 
            required
            name="email"
            value={formData.email} 
            onChange={handleInputChange}
            type="email"
            className={getInputClass('email')} 
        />
        <span>Email</span>
    </label>

    <label className="password-field">
        <input 
            required
            name="password"
            value={formData.password} 
            onChange={handleInputChange}
            type={showPassword ? "text" : "password"}
            className={getInputClass('password')} 
        />
        <span>Password (Min 8 chars long, 2 numbers, 1 special char)</span>
        <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
    </label>
    <label className="password-field">
    <input 
        required
        name="confirmPassword"
        value={formData.confirmPassword} 
        onChange={handleInputChange}
        type={showConfirmPassword ? "text" : "password"}
        className={getInputClass('confirmPassword')} 
    />
    <span>Confirm password</span>
    <button
        type="button"
        className="toggle-password"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    >
      {showConfirmPassword ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )}
    </button>
    </label>
    <div className="role-selection-container">
        {['Buyer', 'Seller', 'Broker'].map((role) => (
        <button
            key={role}
            name="role"
            value={role}
            type="button"
            onClick={handleInputChange}
            className={`role-button ${formData.role === role ? 'active' : ''} ${formData.role === "" ? 'role-invalid' : 'role-valid'}`}
            style={{ borderColor: formData.role === "" ? 'rgb(172, 55, 55)' : '#00a676' }} 
        >
            {role}
        </button>
        ))}
    </div>

    <label className="checkbox-label">
        <input 
            required
            checked={agreedToTerms}
            onChange={(event) => setAgreedToTerms(event.target.checked)}
            type="checkbox" 
            className="checkbox"
            style={{ borderColor: !agreedToTerms ? 'rgb(172, 55, 55)' : '#00a676' }}
        />
        <span>I agree to the <a href="https://www.termsfeed.com/public/uploads/2021/12/sample-privacy-policy-template.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a></span>
    </label>

    <button className="submit" type="submit" disabled={isLoading}>
      {isLoading ? 'Signing up...' : 'Submit'}
    </button>
    <p className="signin">Already have an account? <Link to="/signin">Sign in</Link></p>
    
    <div className="buttons-container">
        <div className="google-login-button">
        <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            version="1.1"
            x="0px"
            y="0px"
            className="google-icon"
            viewBox="0 0 48 48"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
        c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
        c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
        C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
        c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
        c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
        </svg>
        <span>Sign in with Google</span>
        </div>
    </div>
    </form>
  );
};
export default SignUp;