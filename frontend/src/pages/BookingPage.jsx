import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPaw, FaCalendarAlt, FaClock, FaInfoCircle, FaCreditCard } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  
  const [formData, setFormData] = useState({
    petName: '',
    petType: 'dog',
    bookingDate: '',
    timeSlot: '',
    specialInstructions: ''
  });

  const timeSlots = ['9AM-11AM', '11AM-1PM', '1PM-3PM', '3PM-5PM', '5PM-7PM'];
  const petTypes = ['dog', 'cat', 'bird', 'rabbit', 'other'];

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      const response = await api.get(`/services/${serviceId}`);
      setService(response.data.data);
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Failed to load service details');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bookingDate) {
      toast.error('Please select a booking date');
      return;
    }
    if (!formData.timeSlot) {
      toast.error('Please select a time slot');
      return;
    }
    if (!formData.petName) {
      toast.error('Please enter your pet\'s name');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await api.post('/bookings', {
        serviceId: service._id,
        petName: formData.petName,
        petType: formData.petType,
        bookingDate: formData.bookingDate,
        timeSlot: formData.timeSlot,
        specialInstructions: formData.specialInstructions
      });
      
      setBookingData(response.data.data);
      setShowPaymentModal(true);
      toast.success('Booking created! Please complete payment.');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMockPayment = async () => {
    try {
      await api.put(`/bookings/${bookingData._id}/payment`, {
        paymentStatus: 'paid',
        paymentMethod: 'mock'
      });
      
      toast.success('Payment successful! 🎉 Your booking is confirmed!');
      setShowPaymentModal(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  // Rest of the component JSX remains the same...
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!service) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Book Your <span className="text-primary-600">Service</span>
            </h1>
            <p className="text-gray-600">Complete the form below to schedule your appointment</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <FaPaw className="text-primary-600 mr-2" />
                  Booking Details
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Pet Name *</label>
                    <input type="text" name="petName" value={formData.petName} onChange={handleChange} required className="input-field" placeholder="e.g., Max, Luna" />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Pet Type *</label>
                    <select name="petType" value={formData.petType} onChange={handleChange} required className="input-field">
                      {petTypes.map(type => (<option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Booking Date *</label>
                    <input type="date" name="bookingDate" value={formData.bookingDate} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} className="input-field" />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Time Slot *</label>
                    <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} required className="input-field">
                      <option value="">Select a time slot</option>
                      {timeSlots.map(slot => (<option key={slot} value={slot}>{slot}</option>))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Special Instructions</label>
                    <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} rows="3" className="input-field" placeholder="Any special requirements..."></textarea>
                  </div>

                  <button type="submit" disabled={submitting} className="w-full btn-primary">
                    {submitting ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </form>
              </div>
            </div>

            {/* Service Summary */}
            <div>
              <div className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Service Summary</h3>
                <div className="space-y-4">
                  <div><p className="text-white/80 text-sm">Service</p><p className="font-semibold text-lg">{service.name}</p></div>
                  <div><p className="text-white/80 text-sm">Category</p><p className="font-semibold capitalize">{service.category}</p></div>
                  <div><p className="text-white/80 text-sm">Duration</p><p className="font-semibold">{service.duration}</p></div>
                  <div><p className="text-white/80 text-sm">Price</p><p className="text-3xl font-bold">${service.price}</p></div>
                  <div className="border-t border-white/20 pt-4"><p className="text-white/80 text-sm">Total Amount</p><p className="text-4xl font-bold mt-1">${service.price}</p></div>
                </div>
                <div className="mt-6 p-4 bg-white/10 rounded-lg"><div className="flex items-start space-x-2"><FaInfoCircle className="mt-0.5" /><p className="text-sm">Free cancellation up to 24 hours before appointment</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaCreditCard className="text-4xl text-green-600" /></div>
              <h3 className="text-2xl font-bold mb-2">Complete Payment</h3>
              <p className="text-gray-600 mb-6">Total Amount: <span className="font-bold text-2xl text-primary-600">${service?.price}</span></p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left"><p className="text-sm text-gray-600 mb-2 font-semibold">💳 Demo Payment</p><p className="text-xs text-gray-500">Click "Pay Now" to confirm your booking.</p></div>
              <div className="flex gap-4">
                <button onClick={() => setShowPaymentModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={handleMockPayment} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg">Pay ${service?.price}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;