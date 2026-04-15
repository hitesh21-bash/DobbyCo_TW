import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrash, FaEye, FaTimes, FaUserCog, FaCalendarAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm)
      );
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This will also delete all their bookings.`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <FaUserCog className="text-gray-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">User</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Contact</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Joined</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Pets</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {user.phone ? (
                    <div className="flex items-center space-x-1 text-sm">
                      <FaPhone className="text-xs text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No phone</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role === 'admin' ? '👑 Admin' : '🐾 User'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center space-x-1">
                    <FaCalendarAlt className="text-xs text-gray-400" />
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="font-semibold">{user.pets?.length || 0}</span> pets
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete User"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No users found
        </div>
      )}

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">User Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            
            {/* User Profile Header */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto">
                {selectedUser.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold mt-3">{selectedUser.name}</h2>
              <p className="text-gray-500">{selectedUser.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                selectedUser.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {selectedUser.role === 'admin' ? 'Administrator' : 'Customer'}
              </span>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <FaPhone className="mr-2 text-primary-500" />
                Contact Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-400 w-5" />
                  <span className="ml-2">{selectedUser.email}</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-gray-400 w-5" />
                  <span className="ml-2">{selectedUser.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-400 w-5" />
                  <span className="ml-2">Joined: {formatDate(selectedUser.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Address */}
            {selectedUser.address && (selectedUser.address.street || selectedUser.address.city) && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h4 className="font-semibold mb-3">📍 Address</h4>
                <div className="text-sm">
                  <p>{selectedUser.address.street}</p>
                  <p>{selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.zipCode}</p>
                  <p>{selectedUser.address.country}</p>
                </div>
              </div>
            )}

            {/* Pets */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                🐾 Pets ({selectedUser.pets?.length || 0})
              </h4>
              {selectedUser.pets && selectedUser.pets.length > 0 ? (
                <div className="space-y-3">
                  {selectedUser.pets.map((pet, index) => (
                    <div key={index} className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{pet.name}</p>
                          <p className="text-sm text-gray-600 capitalize">{pet.type}</p>
                          {pet.breed && <p className="text-xs text-gray-500">Breed: {pet.breed}</p>}
                          {pet.age && <p className="text-xs text-gray-500">Age: {pet.age} years</p>}
                          {pet.weight && <p className="text-xs text-gray-500">Weight: {pet.weight} kg</p>}
                        </div>
                        {pet.medicalConditions && (
                          <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            Medical Notes
                          </span>
                        )}
                      </div>
                      {pet.medicalConditions && (
                        <p className="text-xs text-red-600 mt-2">⚠️ {pet.medicalConditions}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No pets added yet</p>
              )}
            </div>

            <button onClick={() => setShowModal(false)} className="w-full btn-primary mt-6">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;