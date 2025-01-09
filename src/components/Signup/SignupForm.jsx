import React, { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import authService from '../../services/authService';
import { 
  validateEmail, 
  validatePassword, 
  validateUsername, 
  validateInviteCode,
  validateConfirmPassword 
} from '../../utils/validation';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
      inviteCode: validateInviteCode(formData.inviteCode)
    };

    // Filter out empty error messages
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== '')
    );

    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    try {
      const signupData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        inviteCode: formData.inviteCode
      };

      await authService.signup(signupData);
      // Redirect or show success message here
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'PASSWORD_VALIDATION_ERROR') {
        setErrors(prev => ({
          ...prev,
          password: error.message
        }));
      } else if (error.code === 'INVALID_INVITE') {
        setErrors(prev => ({
          ...prev,
          inviteCode: 'Invalid invite code'
        }));
      } else {
        setApiError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordHelperText = () => {
    if (errors.password) return errors.password;
    return 'Password must contain at least 8 characters, including uppercase, lowercase, and numbers';
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      
      {apiError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {apiError}
        </Typography>
      )}

      <TextField
        fullWidth
        margin="normal"
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={!!errors.username}
        helperText={errors.username}
        autoComplete="username"
      />

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        autoComplete="email"
      />

      <TextField
        fullWidth
        margin="normal"
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={getPasswordHelperText()}
        autoComplete="new-password"
      />

      <TextField
        fullWidth
        margin="normal"
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        autoComplete="new-password"
      />

      <TextField
        fullWidth
        margin="normal"
        label="Invite Code"
        name="inviteCode"
        value={formData.inviteCode}
        onChange={handleChange}
        error={!!errors.inviteCode}
        helperText={errors.inviteCode || 'Enter your invitation code'}
        autoComplete="off"
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        disabled={isLoading}
        sx={{ mt: 3, mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
      </Button>
    </Box>
  );
};

export default SignupForm;