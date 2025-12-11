// Validation utility functions

export const strongPasswordValidation = (password) => {
  const passwordFormat = /^(?=(?:.*\d){2,})(?=.*[^a-zA-Z0-9]).{8,}$/;
  return passwordFormat.test(password);
};

export const emailFormatValidation = (email) => {
  const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailFormat.test(email);
};

// Validation registry pattern
export const fieldValidators = {
  firstname: (value) => {
    if (!value || value.trim() === "" || value.startsWith(" ")) {
      return 'Invalid: Empty firstname input or starts with space';
    }
    return null;
  },

  lastname: (value) => {
    if (!value || value.trim() === "" || value.startsWith(" ")) {
      return 'Invalid: Empty lastname input or starts with space';
    }
    return null;
  },

  email: (value) => {
    if (!value || value.trim() === "") {
      return 'Invalid: Empty email input';
    }
    if (!emailFormatValidation(value)) {
      return 'Invalid email format';
    }
    return null;
  },

  currentPassword: (value) => {
    if (!value) {
      return 'Current Password required';
    }
    return null;
  },

  password: (value) => {
    if (!strongPasswordValidation(value)) {
      return 'Password must be at least 8 characters long and contain at least two numbers, one 1 special character';
    }
    return null;
  },

  confirmPassword: (value, formData) => {
    if (!value) {
      return 'Confirm password required';
    }
    if (value !== formData.password) {
      return 'Passwords don\'t match';
    }
    return null;
  },

  role: (value) => {
    if (value === "") {
      return 'Please select a role';
    }
    return null;
  },

  agreedToTerms: (value) => {
    if (!value) {
      return 'You must agree to the Terms & Conditions';
    }
    return null;
  },

  phone: (value) => {
    if (!value || value.trim() === "") {
      return 'Phone number is required';
    }
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) {
      return 'Please enter a valid phone number (10-15 digits)';
    }
    return null;
  },

  name: (value) => {
    if (!value || value.trim() === "" || value.startsWith(" ")) {
      return 'Name is required';
    }
    return null;
  },

  preferredDate: (value) => {
    if (!value) {
      return 'Preferred date is required';
    }
    return null;
  },

  startTime: (value) => {
    if (!value) {
      return 'Start time is required';
    }
    return null;
  },

  endTime: (value, formData) => {
    if (!value) {
      return 'End time is required';
    }
    if (formData && formData.startTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${value}`);
      const diffMinutes = (end - start) / (1000 * 60);
      if (diffMinutes < 30) {
        return 'Time slot must be at least 30 minutes';
      }
    }
    return null;
  }
};

export const getFieldError = (fieldName, value, formData) => {
  const validator = fieldValidators[fieldName];
  if (!validator) return null;
  return validator(value, formData);
};

export const getInputClass = (fieldName, value, formData) => {
  const error = getFieldError(fieldName, value, formData);
  return error ? "input input-error" : "input input-success";
};
