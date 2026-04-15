const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  petName: {
    type: String,
    required: [true, 'Please add pet name']
  },
  petType: {
    type: String,
    required: [true, 'Please add pet type'],
    enum: ['dog', 'cat', 'bird', 'rabbit', 'other']
  },
  bookingDate: {
    type: Date,
    required: [true, 'Please add booking date']
  },
  timeSlot: {
    type: String,
    required: [true, 'Please add time slot'],
    enum: ['9AM-11AM', '11AM-1PM', '1PM-3PM', '3PM-5PM', '5PM-7PM']
  },
  specialInstructions: {
    type: String,
    maxlength: [500, 'Instructions cannot be more than 500 characters']
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'mock'],
    default: 'mock'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ bookingDate: 1, timeSlot: 1 });

module.exports = mongoose.model('Booking', bookingSchema);