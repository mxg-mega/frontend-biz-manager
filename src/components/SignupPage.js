import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/Card';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import api from '../api';

const SignupPage = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      business_name: '',
      business_address: '',
      business_phone: '',
      business_email: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: 'admin'
    });
  
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  
    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.business_name.trim()) {
        newErrors.business_name = 'Business name is required';
      }
      if (formData.business_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.business_email)) {
        newErrors.business_email = 'Invalid email format';
      }
      if (formData.business_phone && !/^\+?[\d\s-]{10,}$/.test(formData.business_phone)) {
        newErrors.business_phone = 'Invalid phone format';
      }
  
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length > 80) {
        newErrors.username = 'Username must be less than 80 characters';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
  
      return newErrors;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const newErrors = validateForm();
      
      if (Object.keys(newErrors).length === 0) {
        try {
          setSubmitStatus({ type: 'info', message: 'Processing signup...' });
          
          // Create signup payload matching backend expectations
          const signupPayload = {
            business_name: formData.business_name,
            business_address: formData.business_address,
            business_phone: formData.business_phone,
            business_email: formData.business_email,
            username: formData.username,
            password: formData.password,
            role: formData.role
          };
  
          // Register user
          const signupResponse = await api.post('/signup', signupPayload);
  
          if (signupResponse.status === 201) {
            // Automatically login after successful registration
            const loginResponse = await api.post('/login', {
              username: formData.username,
              password: formData.password
            });
  
            // Store user data in localStorage
            localStorage.setItem('token', loginResponse.data.token);
            localStorage.setItem('username', loginResponse.data.username);
            localStorage.setItem('id', loginResponse.data.id);
            localStorage.setItem('business_id', loginResponse.data.business_id);
            localStorage.setItem('role', loginResponse.data.role);
  
            setSubmitStatus({ type: 'success', message: 'Registration successful! Redirecting...' });
            
            // Call onLogin with the user role
            onLogin(loginResponse.data.role);
            
            // Redirect based on role
            setTimeout(() => {
              navigate(loginResponse.data.role === 'admin' ? '/dashboard' : '/sales');
            }, 1500);
          }
        } catch (error) {
          setSubmitStatus({ 
            type: 'error', 
            message: error.response?.data?.message || 'Registration failed. Please try again.'
          });
        }
      } else {
        setErrors(newErrors);
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
        <Card className="w-full max-w-2xl mx-4">
          <CardHeader>
            <CardTitle>Create New Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Business Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    className={errors.business_name ? 'border-red-500' : ''}
                  />
                  {errors.business_name && (
                    <p className="text-red-500 text-sm">{errors.business_name}</p>
                  )}
                </div>
  
                <div className="space-y-2">
                  <Label htmlFor="business_address">Address</Label>
                  <Input
                    id="business_address"
                    name="business_address"
                    value={formData.business_address}
                    onChange={handleChange}
                  />
                </div>
  
                <div className="space-y-2">
                  <Label htmlFor="business_phone">Phone</Label>
                  <Input
                    id="business_phone"
                    name="business_phone"
                    value={formData.business_phone}
                    onChange={handleChange}
                    className={errors.business_phone ? 'border-red-500' : ''}
                  />
                  {errors.business_phone && (
                    <p className="text-red-500 text-sm">{errors.business_phone}</p>
                  )}
                </div>
  
                <div className="space-y-2">
                  <Label htmlFor="business_email">Email</Label>
                  <Input
                    id="business_email"
                    name="business_email"
                    type="email"
                    value={formData.business_email}
                    onChange={handleChange}
                    className={errors.business_email ? 'border-red-500' : ''}
                  />
                  {errors.business_email && (
                    <p className="text-red-500 text-sm">{errors.business_email}</p>
                  )}
                </div>
              </div>
  
              {/* User Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">User Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={errors.username ? 'border-red-500' : ''}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username}</p>
                  )}
                </div>
  
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>
  
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
  
              {submitStatus.message && (
                <Alert className={`${
                  submitStatus.type === 'error' ? 'bg-red-50' :
                  submitStatus.type === 'success' ? 'bg-green-50' :
                  'bg-blue-50'
                }`}>
                  <AlertDescription>
                    {submitStatus.message}
                  </AlertDescription>
                </Alert>
              )}
  
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  export default SignupPage;