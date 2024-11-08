import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Alert, AlertDescription } from "./ui/alert"
import api from '../api';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '',
    role: 'admin'
  });

  const userId = localStorage.getItem('id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/${userId}`);
        const userData = response.data;
        setSettings(prevUser => ({
          ...prevUser,
          name: userData.username,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Send a PUT request to update user settings
      const response = await api.put(`/users/${userId}`, {
        username: settings.name,
        password: settings.password, // Include password only if it's updated
        role: settings.role
      });

      // Handle success response
      if (response.status === 200) {
        alert('Settings updated successfully!');
        // fetch the user data again to reflect the changes
        // fetchUser();
      }
    } catch (err) {
      setError('Failed to update user settings');
      console.error('Error updating user settings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={settings.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  value={settings.role}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={settings.password}
                  onChange={handleInputChange}
                  placeholder="Enter a new password"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button type="submit" className="w-full">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
