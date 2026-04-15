import React, { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaTimes, FaSpinner, FaSearch, FaFilter, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, statusFilter, bookings]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.data);
      setFilteredBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];
    
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.petName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }
    
    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Booking ${newStatus} successfully`);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FaSpinner, text: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: FaCheck, text: 'Confirmed' },
      completed: { color: 'bg-green-100 text-green-800', icon: FaCheck, text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: FaTimes, text: 'Cancelled' }
    };
    const cfg = config[status] || config.pending;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
        <Icon className="text-xs" />
        <span>{cfg.text}</span>
      </span>
    );
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
              placeholder="Search by user or pet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">User</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Service</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Pet</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{booking.user?.name}</p>
                    <p className="text-xs text-gray-500">{booking.user?.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium">{booking.service?.name}</span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p>{booking.petName}</p>
                    <p className="text-xs text-gray-500 capitalize">{booking.petType}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p>{formatDate(booking.bookingDate)}</p>
                    <p className="text-xs text-gray-500">{booking.timeSlot}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-green-600">${booking.totalPrice}</span>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowModal(true);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FaEye />
                    </button>
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Confirm"
                      >
                        <FaCheck />
                      </button>
                    )}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Cancel"
                      >
                        <FaTimes />
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'completed')}
                        className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                        title="Mark Complete"
                      >
                        <FaCheck />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No bookings found
        </div>
      )}

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Booking Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">User</p>
                  <p className="font-semibold">{selectedBooking.user?.name}</p>
                  <p className="text-sm">{selectedBooking.user?.email}</p>
                  <p className="text-sm">{selectedBooking.user?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-semibold">{selectedBooking.service?.name}</p>
                  <p className="text-sm">Duration: {selectedBooking.service?.duration}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Pet Details</p>
                  <p className="font-semibold">{selectedBooking.petName}</p>
                  <p className="text-sm capitalize">Type: {selectedBooking.petType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Appointment</p>
                  <p>{formatDate(selectedBooking.bookingDate)}</p>
                  <p className="text-sm">{selectedBooking.timeSlot}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Special Instructions</p>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">
                  {selectedBooking.specialInstructions || 'No special instructions'}
                </p>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold text-xl text-primary-600">${selectedBooking.totalPrice}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">Payment Status:</span>
                  <span className={`text-sm font-semibold ${selectedBooking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {selectedBooking.paymentStatus?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;