const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'other'],
    required: true
  },
  breed: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: null
  },
  weight: {
    type: Number,
    default: null
  },
  medicalConditions: {
    type: String,
    default: ''
  }
});

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'service_provider', 'breeder', 'trainer', 'veterinarian'],
    default: 'user'
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be more than 20 characters'],
    default: ''
  },
  address: {
    type: addressSchema,
    default: {}
  },
  pets: [petSchema],
  // Additional fields for service providers
  businessName: {
    type: String,
    default: ''
  },
  businessLicense: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);