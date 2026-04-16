import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaMoneyBillWave, FaEye, FaTimes, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await api.delete(`/bookings/${bookingId}`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FaSpinner, text: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: FaCheckCircle, text: 'Confirmed' },
      completed: { color: 'bg-green-100 text-green-800', icon: FaCheckCircle, text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: FaTimes, text: 'Cancelled' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon className="text-xs" />
        <span>{config.text}</span>
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    if (status === 'paid') {
      return <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"><FaCheckCircle /> <span>Paid</span></span>;
    }
    return <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800"><FaSpinner /> <span>Pending</span></span>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
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

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCalendarAlt className="text-4xl text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
        <p className="text-gray-500 mb-4">You haven't made any bookings yet.</p>
        <a href="/services" className="btn-primary inline-block">Browse Services</a>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
            <div className="flex flex-wrap justify-between items-start gap-4">
              {/* Service Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-bold text-lg">{booking.service?.name}</h3>
                  {getStatusBadge(booking.status)}
                  {getPaymentBadge(booking.paymentStatus)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                  <div className="flex items-center space-x-2">
                    <span>🐾 Pet: <strong>{booking.petName}</strong> ({booking.petType})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-primary-500" />
                    <span>Date: {formatDate(booking.bookingDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-primary-500" />
                    <span>Time: {booking.timeSlot}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaMoneyBillWave className="text-green-500" />
                    <span>Amount: <strong className="text-green-600">${booking.totalPrice}</strong></span>
                  </div>
                </div>
                {booking.specialInstructions && (
                  <p className="text-sm text-gray-500 mt-2">
                    📝 Notes: {booking.specialInstructions}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowModal(true);
                  }}
                  className="px-3 py-1 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <FaEye className="inline mr-1" /> Details
                </button>
                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <button
                    onClick={() => cancelBooking(booking._id)}
                    className="px-3 py-1 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <FaTimes className="inline mr-1" /> Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Booking Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-semibold">{selectedBooking.service?.name}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Pet</p>
                <p className="font-semibold">{selectedBooking.petName} ({selectedBooking.petType})</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-semibold">{formatDate(selectedBooking.bookingDate)} at {selectedBooking.timeSlot}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Status</p>
                <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Payment</p>
                <div className="mt-1">{getPaymentBadge(selectedBooking.paymentStatus)}</div>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-bold text-xl text-primary-600">${selectedBooking.totalPrice}</p>
              </div>
              {selectedBooking.specialInstructions && (
                <div>
                  <p className="text-sm text-gray-500">Special Instructions</p>
                  <p className="text-sm">{selectedBooking.specialInstructions}</p>
                </div>
              )}
              <div className="pt-4">
                <p className="text-xs text-gray-400">Booking ID: {selectedBooking._id}</p>
                <p className="text-xs text-gray-400">Created: {new Date(selectedBooking.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <button onClick={() => setShowModal(false)} className="w-full btn-primary mt-6">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;