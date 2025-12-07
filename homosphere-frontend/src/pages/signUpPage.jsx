import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/signUpStyle.css';
import { signUpWithEmail } from '../services/apiSignUp';
import { getFieldError, getInputClass } from '../utils/validators';
import { ROUTES, EXTERNAL_LINKS } from '../constants/routes';
import { COLORS } from '../constants/colors';
import FormInput from '../components/FormInput';
import PasswordInput from '../components/PasswordInput';
import RoleSelector from '../components/RoleSelector';
import GoogleSignInButton from '../components/GoogleSignInButton';
import MessageDisplay from '../components/MessageDisplay';

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

  const setErrorMessage = (message)=> {
    setError(message);
    setTimeout(()=> setError('') , 4000);
  };

  const validateAllFields = () => {
    const fieldsToCheck = ['firstname', 'lastname', 'email', 'password', 'confirmPassword', 'role'];

    for (const fieldName of fieldsToCheck) {
        const errorMsg = getFieldError(fieldName, formData[fieldName], formData);
        if (errorMsg) {
            setErrorMessage(errorMsg);
            return false;
        }
    }

    if (!agreedToTerms) {
        setErrorMessage("You must agree to the Terms & Conditions");
        return false;
    }

    return true;
  };

  const sendDataToSupabase = async () => {
    return await signUpWithEmail(
      formData.email,
      formData.password,
      formData.firstname,
      formData.lastname,
      formData.role
    );
  };

  const clearForm = () => {
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    });
    setAgreedToTerms(false);
  };

  const redirectUser = () => {
    setTimeout(() => {
      navigate(ROUTES.SIGNIN);
    }, 5000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validateAllFields()) return;

    setIsLoading(true);
    try {
      const result = await sendDataToSupabase();

      if (result.success) {
        setSuccessMessage(result.message);
        clearForm();
        redirectUser();
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
    <div className="auth-page-center">
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Register</p>
        <p className="message">Signup now and get full access to our app.</p>
        <MessageDisplay error={error} successMessage={successMessage} />
        <div className="flex">
          <div>
            <FormInput
              required
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              type="text"
              className={getInputClass('firstname', formData.firstname, formData)}
              label="Firstname"
            />
          </div>
          <div>
            <FormInput
              required
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              type="text"
              className={getInputClass('lastname', formData.lastname, formData)}
              label="Lastname"
            />
          </div>
        </div>
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
          label="Password (Min 8 chars long, 2 numbers, 1 special char)"
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
        <PasswordInput
          required
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className={getInputClass('confirmPassword', formData.confirmPassword, formData)}
          label="Confirm password"
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />
        <RoleSelector
          selectedRole={formData.role}
          onChange={handleInputChange}
        />
        <label className="checkbox-label">
          <input
            required
            checked={agreedToTerms}
            onChange={(event) => setAgreedToTerms(event.target.checked)}
            type="checkbox"
            className="checkbox"
            style={{ borderColor: !agreedToTerms ? COLORS.DARK_RED : COLORS.JUNGLE_GREEN }}
          />
          <span>I agree to the <a href={EXTERNAL_LINKS.PRIVACY_POLICY} target="_blank" rel="noopener noreferrer">Privacy Policy</a></span>
        </label>
        <button className="submit" type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Submit'}
        </button>
        <p className="signin">Already have an account? <Link to={ROUTES.SIGNIN}>Sign in</Link></p>
        <GoogleSignInButton />
      </form>
    </div>
  );
};

export default SignUp;