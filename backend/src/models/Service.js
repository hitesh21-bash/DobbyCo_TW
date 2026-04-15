const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a service name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Service name cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['grooming', 'vet', 'daycare', 'boarding', 'walking', 'training'],
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: String,
    required: [true, 'Please add duration'],
    enum: ['30min', '1hour', '2hours', 'full-day', 'overnight']
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=500'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);