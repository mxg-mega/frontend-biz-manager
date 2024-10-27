import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '',
    role: 'admin'
  });
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the updated settings to your backend
    console.log('Settings updated:', settings);
  };

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
