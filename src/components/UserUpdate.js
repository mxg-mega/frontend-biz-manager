import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "./ui/button"
import { Input } from "./ui/Input"
import { Label } from "./ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Alert, AlertDescription } from "./ui/alert"
import api from '../api';
import { useNavigate } from 'react-router-dom';

const UserUpdate = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
      username: '',
      role: '',
      password: '',
      confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/users/${userId}`);
          const userData = response.data;
          setUser(prevUser => ({
            ...prevUser,
            username: userData.username,
            role: userData.role
          }));
        } catch (err) {
          setError('Failed to fetch user data');
          console.error('Error fetching user data:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUser();
    }, [userId]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setUser(prevUser => ({
        ...prevUser,
        [name]: value
      }));
    };
  
    const handleRoleChange = (value) => {
      setUser(prevUser => ({
        ...prevUser,
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
        const updateData = {
          username: user.username,
          role: user.role
        };
        if (user.password) {
          updateData.password = user.password;
        }
        await api.put(`/users/${userId}`, updateData);
        setSuccess(true);
        setError(null);
        // Redirect to users list after successful update
        setTimeout(() => navigate('/users'), 2000);
      } catch (err) {
        setError('Failed to update user information');
        setSuccess(false);
        console.error('Error updating user:', err);
      }
    };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;
  
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Update User Information</CardTitle>
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
                <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={user.password}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={user.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit">Update Information</Button>
            </form>
            {success && (
              <Alert className="mt-4">
                <AlertDescription>User information updated successfully! Redirecting...</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default UserUpdate;