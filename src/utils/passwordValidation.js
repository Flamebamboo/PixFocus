export const validateEmail = (email) => {
  if (email.length < 5) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username) => {
  if (username.length < 3) return { isValid: false, message: 'Username must be at least 3 characters' };
  if (username.includes('@')) return { isValid: false, message: 'Username cannot contain @ symbol' };
  if (username === '') return { isValid: false, message: 'Username cannot be empty' };
  return { isValid: true, message: '' };
};

export const validatePassword = (password) => {
  const requirements = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*(),.?":{}|<>]/.test(password),
  ];
  const validCount = requirements.filter(Boolean).length;
  return validCount >= 3; // Password is valid if it meets at least 3 requirements
};
