import React, { useState, useEffect } from 'react';
import { Pencil, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';
import api from '../api';
import { useToast } from "./ui/use-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users', { params: { business_id: localStorage.getItem('business_id') } });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = (userId) => {
    // Implement delete functionality
    console.log('Delete user with ID:', userId);
    api.delete(`/users/${userId}`)
      .then(() => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        toast({ title: 'User  deleted successfully.', variant: 'success' });
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        toast({ title: 'Error deleting user. Please try again.', variant: 'error' });
      });
  };

  const handleEdit = (userId) => {
    // Implement edit functionality
    console.log('Edit user with ID:', userId);
    navigate(`/users/${userId}/edit`);
  };

  const handleAddUser = () => {
    // Implement add user
    // navigate to user registration page
    navigate(`/users/user-registration`);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-semibold mb-4">Users</h2>
      <div className="flex justify-end mb-4">
        <Button variant="default" onClick={handleAddUser}>Add New User</Button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleEdit(user.id)}>
                    <Pencil className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button variant="ghost" onClick={() => handleDelete(user.id)}>
                    <Trash className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;