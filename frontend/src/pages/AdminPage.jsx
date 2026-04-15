import React, { useState, useEffect } from 'react';
import { FaUsers, FaCalendarAlt, FaPaw, FaDollarSign, FaChartLine, FaClipboardList, FaUserCog, FaTags } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import ManageBookings from '../components/admin/ManageBookings';
import ManageServices from '../components/admin/ManageServices';
import ManageUsers from '../components/admin/ManageUsers';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    completedBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const [usersRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/bookings', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const bookings = bookingsRes.data.data;
      const completedBookings = bookings.filter(b => b.status === 'completed');
      const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
      
      setStats({
        totalUsers: usersRes.data.count,
        totalBookings: bookings.length,
        totalRevenue,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        completedBookings: completedBookings.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'bookings', label: 'Bookings', icon: FaCalendarAlt },
    { id: 'services', label: 'Services', icon: FaPaw },
    { id: 'users', label: 'Users', icon: FaUsers }
  ];

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: FaUsers, color: 'from-blue-500 to-blue-600' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: FaCalendarAlt, color: 'from-purple-500 to-purple-600' },
    { title: 'Pending Bookings', value: stats.pendingBookings, icon: FaClipboardList, color: 'from-yellow-500 to-yellow-600' },
    { title: 'Completed', value: stats.completedBookings, icon: FaTags, color: 'from-green-500 to-green-600' },
    { title: 'Total Revenue', value: `$${stats.totalRevenue}`, icon: FaDollarSign, color: 'from-emerald-500 to-emerald-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 text-white animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <FaUserCog className="mr-3 text-primary-500" />
                  Admin Dashboard
                </h1>
                <p className="text-gray-300">
                  Manage users, bookings, and services from one central location
                </p>
              </div>
              <div className="bg-white/10 rounded-full px-4 py-2">
                <span className="font-semibold">Welcome back, Admin</span>
              </div>
            </div>
          </div>

          {/* Stats Cards - Overview Tab Only */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {statCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={index}
                    className={`bg-gradient-to-r ${card.color} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 animate-fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">{card.title}</p>
                        <p className="text-2xl font-bold mt-1">{card.value}</p>
                      </div>
                      <Icon className="text-3xl text-white/30" />
                    </div>
                  </div>
                );
              })}
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
                          ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                          : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
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
              {activeTab === 'overview' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
                  <p className="text-gray-600 mb-6">
                    Welcome to the DobbyCo admin panel. Here you can manage all aspects of the platform.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
                      <h3 className="font-bold text-lg mb-3">Quick Actions</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => setActiveTab('bookings')}
                          className="w-full text-left px-4 py-2 bg-white rounded-lg hover:shadow-md transition"
                        >
                          📅 View All Bookings
                        </button>
                        <button
                          onClick={() => setActiveTab('services')}
                          className="w-full text-left px-4 py-2 bg-white rounded-lg hover:shadow-md transition"
                        >
                          🐾 Manage Services
                        </button>
                        <button
                          onClick={() => setActiveTab('users')}
                          className="w-full text-left px-4 py-2 bg-white rounded-lg hover:shadow-md transition"
                        >
                          👥 Manage Users
                        </button>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                      <h3 className="font-bold text-lg mb-3">Platform Status</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Active Users:</span>
                          <span className="font-bold">{stats.totalUsers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Bookings:</span>
                          <span className="font-bold">{stats.totalBookings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Completion Rate:</span>
                          <span className="font-bold">
                            {stats.totalBookings ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'bookings' && <ManageBookings />}
              {activeTab === 'services' && <ManageServices />}
              {activeTab === 'users' && <ManageUsers />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;