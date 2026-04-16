import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaCalendarAlt, FaPaw, FaHeart, FaCheckCircle, FaTimesCircle, FaSpinner, FaBriefcase, FaChartLine, FaUsers, FaDollarSign } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import MyBookings from '../components/dashboard/MyBookings';
import Profile from '../components/dashboard/Profile';

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalBookings: 0,
    completed: 0,
    pending: 0,
    cancelled: 0
  });
  const [providerStats, setProviderStats] = useState({
    totalServices: 0,
    totalEarnings: 0,
    totalBookings: 0,
    pendingVerification: false
  });

  useEffect(() => {
    if (user?.role === 'user') {
      fetchBookingStats();
    } else if (user?.role !== 'user' && user?.role !== 'admin') {
      fetchProviderStats();
    }
  }, [user]);

  const fetchBookingStats = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
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

  const fetchProviderStats = async () => {
    setProviderStats({
      totalServices: 5,
      totalEarnings: 1249.95,
      totalBookings: 23,
      pendingVerification: !user?.isVerified
    });
  };

  const getUserTabs = () => [
    { id: 'bookings', label: 'My Bookings', icon: FaCalendarAlt },
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'pets', label: 'My Pets', icon: FaPaw }
  ];

  const getProviderTabs = () => [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'services', label: 'My Services', icon: FaBriefcase },
    { id: 'providerBookings', label: 'Service Bookings', icon: FaCalendarAlt },
    { id: 'earnings', label: 'Earnings', icon: FaDollarSign },
    { id: 'profile', label: 'Profile', icon: FaUser }
  ];

  const getAdminTabs = () => [
    { id: 'overview', label: 'Admin Overview', icon: FaChartLine },
    { id: 'users', label: 'Manage Users', icon: FaUsers },
    { id: 'bookings', label: 'All Bookings', icon: FaCalendarAlt },
    { id: 'services', label: 'Services', icon: FaBriefcase }
  ];

  let tabs = getUserTabs();
  let welcomeMessage = "Manage your bookings, profile, and pet information all in one place.";
  let headerIcon = <FaHeart className="text-3xl animate-pulse" />;

  if (user?.role === 'admin') {
    tabs = getAdminTabs();
    welcomeMessage = "Manage users, bookings, and platform services from your admin panel.";
    headerIcon = <FaUsers className="text-3xl" />;
  } else if (user?.role !== 'user' && user?.role !== 'admin') {
    tabs = getProviderTabs();
    welcomeMessage = "Manage your services, track bookings, and grow your pet business.";
    headerIcon = <FaBriefcase className="text-3xl" />;
  }

  const getRoleTitle = () => {
    switch(user?.role) {
      case 'admin': return 'Admin Dashboard';
      case 'service_provider': return 'Service Provider Dashboard';
      case 'breeder': return 'Breeder Dashboard';
      case 'trainer': return 'Trainer Dashboard';
      case 'veterinarian': return 'Veterinarian Dashboard';
      default: return 'Customer Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 mb-8 text-white animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {getRoleTitle()}
                </h1>
                <p className="text-white/90">
                  Welcome back, {user?.name?.split(' ')[0]}! 👋 {welcomeMessage}
                </p>
              </div>
              <div className="bg-white/20 rounded-full p-4">
                {headerIcon}
              </div>
            </div>
            {user?.role !== 'user' && user?.role !== 'admin' && !user?.isVerified && (
              <div className="mt-4 bg-yellow-500/30 rounded-lg p-3">
                <p className="text-sm">⚠️ Your account is pending verification. You'll be able to offer services once verified by admin.</p>
              </div>
            )}
          </div>

          {/* Stats Cards - User */}
          {user?.role === 'user' && (
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
          )}

          {/* Stats Cards - Provider */}
          {(user?.role !== 'user' && user?.role !== 'admin') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-800">{providerStats.totalBookings}</p>
                  </div>
                  <FaCalendarAlt className="text-3xl text-primary-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-600">${providerStats.totalEarnings}</p>
                  </div>
                  <FaDollarSign className="text-3xl text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Active Services</p>
                    <p className="text-2xl font-bold text-blue-600">{providerStats.totalServices}</p>
                  </div>
                  <FaBriefcase className="text-3xl text-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="border-b border-gray-200 overflow-x-auto">
              <div className="flex">
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
              {/* User Tabs */}
              {activeTab === 'bookings' && user?.role === 'user' && <MyBookings />}
              {activeTab === 'profile' && <Profile />}
              {activeTab === 'pets' && user?.role === 'user' && <PetsComponent />}
              
              {/* Provider Tabs */}
              {activeTab === 'overview' && (user?.role !== 'user' && user?.role !== 'admin') && <ProviderOverviewComponent />}
              {activeTab === 'services' && (user?.role !== 'user' && user?.role !== 'admin') && <ProviderServicesComponent />}
              {activeTab === 'providerBookings' && (user?.role !== 'user' && user?.role !== 'admin') && <ProviderBookingsComponent />}
              {activeTab === 'earnings' && (user?.role !== 'user' && user?.role !== 'admin') && <ProviderEarningsComponent />}
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
      const response = await api.get('/users/pets');
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
      await api.post('/users/pets', formData);
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

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">My Pets</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary text-sm px-4 py-2">
          {showAddForm ? 'Cancel' : '+ Add New Pet'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddPet} className="bg-gray-50 rounded-xl p-6 mb-6 animate-fade-in">
          <h3 className="font-semibold mb-4">Add New Pet</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Pet Name *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="input-field" />
            <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="input-field">
              {petTypes.map(type => (<option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>))}
            </select>
            <input type="text" placeholder="Breed" value={formData.breed} onChange={(e) => setFormData({...formData, breed: e.target.value})} className="input-field" />
            <input type="number" placeholder="Age (years)" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="input-field" />
            <input type="number" placeholder="Weight (kg)" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="input-field" />
            <textarea placeholder="Medical Conditions" value={formData.medicalConditions} onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})} className="input-field md:col-span-2" rows="2" />
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
                  {pet.medicalConditions && <p className="text-sm text-red-600 mt-2">⚠️ {pet.medicalConditions}</p>}
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

// Provider Overview Component
const ProviderOverviewComponent = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Welcome to Your Provider Dashboard</h2>
      <p className="text-gray-600 mb-6">
        Manage your services, track bookings, and grow your pet business with DobbyCo.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-3">📋 Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:shadow-md transition">
              ➕ Add New Service
            </button>
            <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:shadow-md transition">
              📅 View Today's Bookings
            </button>
            <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:shadow-md transition">
              💰 Withdraw Earnings
            </button>
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-3">📊 Tips for Success</h3>
          <ul className="space-y-2 text-sm">
            <li>✓ Respond to booking requests quickly</li>
            <li>✓ Keep your service calendar updated</li>
            <li>✓ Collect reviews from happy customers</li>
            <li>✓ Offer competitive pricing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Provider Services Component
const ProviderServicesComponent = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">My Services</h2>
        <button className="btn-primary text-sm px-4 py-2">+ Add New Service</button>
      </div>
      <div className="text-center py-12 text-gray-500">
        <FaBriefcase className="text-5xl mx-auto mb-4 text-gray-300" />
        <p>You haven't added any services yet.</p>
        <p className="text-sm mt-2">Click "Add New Service" to start offering your expertise!</p>
      </div>
    </div>
  );
};

// Provider Bookings Component
const ProviderBookingsComponent = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Service Bookings</h2>
      <div className="text-center py-12 text-gray-500">
        <FaCalendarAlt className="text-5xl mx-auto mb-4 text-gray-300" />
        <p>No bookings yet.</p>
        <p className="text-sm mt-2">Once customers book your services, they'll appear here.</p>
      </div>
    </div>
  );
};

// Provider Earnings Component
const ProviderEarningsComponent = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Earnings Overview</h2>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
        <p className="text-gray-600">Total Earnings</p>
        <p className="text-4xl font-bold text-green-600">$1,249.95</p>
        <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
      </div>
      <div className="text-center py-8 text-gray-500">
        <p>Detailed earnings report coming soon!</p>
      </div>
    </div>
  );
};

export default DashboardPage;