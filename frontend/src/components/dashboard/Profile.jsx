import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarker, FaEdit, FaSave, FaTimes, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: { street: '', city: '', state: '', zipCode: '', country: '' }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      // Reload user data
      const response = await api.get('/auth/me');
      const { data } = response.data;
      localStorage.setItem('user', JSON.stringify(data));
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="w-28 h-28 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
            <FaUserCircle className="text-6xl text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
        <p className="text-gray-500 capitalize">{user.role}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center"><FaUser className="mr-2 text-primary-600" /> Profile Information</h3>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center space-x-1 px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50"><FaEdit /><span>Edit</span></button>
          ) : (
            <div className="flex space-x-2">
              <button onClick={() => setIsEditing(false)} className="flex items-center space-x-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"><FaTimes /><span>Cancel</span></button>
              <button onClick={handleSubmit} disabled={loading} className="flex items-center space-x-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"><FaSave /><span>{loading ? 'Saving...' : 'Save'}</span></button>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div><label className="block text-gray-700 font-semibold mb-2"><FaUser className="inline mr-2 text-primary-500" /> Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className={`input-field ${!isEditing && 'bg-gray-50'}`} /></div>
          <div><label className="block text-gray-700 font-semibold mb-2"><FaEnvelope className="inline mr-2 text-primary-500" /> Email Address</label><input type="email" value={user.email} disabled className="input-field bg-gray-50" /><p className="text-xs text-gray-400 mt-1">Email cannot be changed</p></div>
          <div><label className="block text-gray-700 font-semibold mb-2"><FaPhone className="inline mr-2 text-primary-500" /> Phone Number</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} className={`input-field ${!isEditing && 'bg-gray-50'}`} /></div>
          
          <div><label className="block text-gray-700 font-semibold mb-3"><FaMapMarker className="inline mr-2 text-primary-500" /> Address</label>
            <div className="space-y-3">
              <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} disabled={!isEditing} placeholder="Street Address" className={`input-field ${!isEditing && 'bg-gray-50'}`} />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} disabled={!isEditing} placeholder="City" className={`input-field ${!isEditing && 'bg-gray-50'}`} />
                <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} disabled={!isEditing} placeholder="State" className={`input-field ${!isEditing && 'bg-gray-50'}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} disabled={!isEditing} placeholder="ZIP Code" className={`input-field ${!isEditing && 'bg-gray-50'}`} />
                <input type="text" name="address.country" value={formData.address.country} onChange={handleChange} disabled={!isEditing} placeholder="Country" className={`input-field ${!isEditing && 'bg-gray-50'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;