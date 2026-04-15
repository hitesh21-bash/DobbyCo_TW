import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaCalendarAlt, FaPaw, FaEdit, FaHeart, FaClock, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import MyBookings from '../components/dashboard/MyBookings';
import Profile from '../components/dashboard/Profile';

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [stats, setStats] = useState({
    totalBookings: 0,
    completed: 0,
    pending: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchBookingStats();
  }, []);

  const fetchBookingStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const bookings = response.data.data;
      const completed = bookings.filter(b => b.status === 'completed').length;
      const pending = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
      const cancelled = bookings.filter(b => b.status === 'cancelled').length;
      
      setStats({
        totalBookings: bookings.length,
        completed,
        pending,
        cancelled
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const tabs = [
    { id: 'bookings', label: 'My Bookings', icon: FaCalendarAlt },
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'pets', label: 'My Pets', icon: FaPaw }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 mb-8 text-white animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-white/90">
                  Manage your bookings, profile, and pet information all in one place.
                </p>
              </div>
              <div className="bg-white/20 rounded-full p-4">
                <FaHeart className="text-3xl animate-pulse" />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
                </div>
                <FaCalendarAlt className="text-3xl text-primary-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <FaCheckCircle className="text-3xl text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <FaSpinner className="text-3xl text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
                <FaTimesCircle className="text-3xl text-red-500" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all duration-200 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-600 hover:text-primary-500'
                      }`}
                    >
                      <Icon />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'bookings' && <MyBookings />}
              {activeTab === 'profile' && <Profile />}
              {activeTab === 'pets' && <PetsComponent />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pets Component
const PetsComponent = () => {
  const [pets, setPets] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog',
    breed: '',
    age: '',
    weight: '',
    medicalConditions: ''
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/pets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPets(response.data.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/users/pets', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Pet added successfully!');
      setShowAddForm(false);
      setFormData({
        name: '',
        type: 'dog',
        breed: '',
        age: '',
        weight: '',
        medicalConditions: ''
      });
      fetchPets();
    } catch (error) {
      toast.error('Failed to add pet');
    }
  };

  const petTypes = ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'other'];

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">My Pets</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary text-sm px-4 py-2"
        >
          {showAddForm ? 'Cancel' : '+ Add New Pet'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddPet} className="bg-gray-50 rounded-xl p-6 mb-6 animate-fade-in">
          <h3 className="font-semibold mb-4">Add New Pet</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Pet Name *"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="input-field"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="input-field"
            >
              {petTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Breed"
              value={formData.breed}
              onChange={(e) => setFormData({...formData, breed: e.target.value})}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Age (years)"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              className="input-field"
            />
            <textarea
              placeholder="Medical Conditions (if any)"
              value={formData.medicalConditions}
              onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})}
              className="input-field md:col-span-2"
              rows="2"
            />
          </div>
          <button type="submit" className="btn-primary mt-4">Save Pet</button>
        </form>
      )}

      {pets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FaPaw className="text-5xl mx-auto mb-4 text-gray-300" />
          <p>No pets added yet. Add your furry friend!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {pets.map((pet, index) => (
            <div key={index} className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{pet.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{pet.type}</p>
                  {pet.breed && <p className="text-sm text-gray-600">Breed: {pet.breed}</p>}
                  {pet.age && <p className="text-sm text-gray-600">Age: {pet.age} years</p>}
                  {pet.weight && <p className="text-sm text-gray-600">Weight: {pet.weight} kg</p>}
                  {pet.medicalConditions && (
                    <p className="text-sm text-red-600 mt-2">⚠️ {pet.medicalConditions}</p>
                  )}
                </div>
                <FaPaw className="text-3xl text-primary-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;