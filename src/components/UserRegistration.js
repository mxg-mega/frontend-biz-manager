import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Alert, AlertDescription } from "./ui/alert";
import api from '../api';
import { useNavigate } from 'react-router-dom';

const UserRegistration = () => {
    const navigate = useNavigate();
    const [user, setUser ] = useState({
        username: '',
        role: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser (prevUser  => ({
            ...prevUser ,
            [name]: value
        }));
    };

    const handleRoleChange = (value) => {
        setUser (prevUser  => ({
            ...prevUser ,
            role: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.password !== user.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            setLoading(true);
            const registrationData = {
                username: user.username,
                role: user.role,
                password: user.password,
                business_id: localStorage.getItem('business_id'),
            };
            await api.post('/users', registrationData);
            setSuccess(true);
            setError(null);
            // Redirect to users list after successful registration
            setTimeout(() => navigate('/users'), 2000);
        } catch (err) {
            setError('Failed to register user');
            setSuccess(false);
            console.error('Error registering user:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Register New User</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select onValueChange={handleRoleChange} value={user.role}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={user.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={user.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading}>Register User</Button>
                    </form>
                    {success && (
                        <Alert className="mt-4">
                            <AlertDescription>User registered successfully! Redirecting...</AlertDescription>
                        </Alert>
                    )}
                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UserRegistration;