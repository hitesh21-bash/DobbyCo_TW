import React from 'react';
import { FaChartLine, FaCalendarCheck, FaUsers, FaStar, FaMoneyBillWave } from 'react-icons/fa';

const ProviderDashboard = () => {
  const stats = {
    totalBookings: 23,
    completedBookings: 18,
    pendingBookings: 5,
    totalEarnings: 1249.95,
    averageRating: 4.8,
    totalCustomers: 15
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Provider Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <FaCalendarCheck className="text-2xl mb-2" />
          <p className="text-sm opacity-90">Total Bookings</p>
          <p className="text-2xl font-bold">{stats.totalBookings}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <FaMoneyBillWave className="text-2xl mb-2" />
          <p className="text-sm opacity-90">Total Earnings</p>
          <p className="text-2xl font-bold">${stats.totalEarnings}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <FaUsers className="text-2xl mb-2" />
          <p className="text-sm opacity-90">Customers</p>
          <p className="text-2xl font-bold">{stats.totalCustomers}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
          <FaStar className="text-2xl mb-2" />
          <p className="text-sm opacity-90">Rating</p>
          <p className="text-2xl font-bold">{stats.averageRating} ⭐</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium">New booking from John Doe</p>
              <p className="text-sm text-gray-500">Dog Grooming - Today at 2PM</p>
            </div>
            <span className="text-green-600 text-sm">Pending confirmation</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="font-medium">Service completed</p>
              <p className="text-sm text-gray-500">Cat Spa - Yesterday</p>
            </div>
            <span className="text-blue-600 text-sm">Completed</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Payment received</p>
              <p className="text-sm text-gray-500">$49.99 from Sarah Johnson</p>
            </div>
            <span className="text-green-600 text-sm">Paid</span>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-3">💡 Tips for Success</h3>
        <ul className="space-y-2 text-sm">
          <li>✓ Respond to booking requests within 24 hours</li>
          <li>✓ Keep your calendar updated to avoid double bookings</li>
          <li>✓ Ask customers to leave reviews after service completion</li>
          <li>✓ Update your service prices based on demand</li>
        </ul>
      </div>
    </div>
  );
};

export default ProviderDashboard;