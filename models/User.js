// models/User.js - Update the User model with password fix

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password matches
userSchema.methods.matchPassword = async function(enteredPassword) {
  // Safety check to prevent bcrypt errors
  if (!this.password) {
    console.log('Password field is undefined for user:', this.email);
    return false;
  }
  
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Method to create email verification token
userSchema.methods.createVerificationToken = function() {
  // Generate random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Hash token and store in database
  this.verificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // Set expiration (24 hours)
  this.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  
  return token;
};

// Method to create password reset token
userSchema.methods.createPasswordResetToken = function() {
  // Generate random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Hash token and store in database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // Set expiration (1 hour)
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  
  return token;
};

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ verificationToken: 1, verificationExpires: 1 });
userSchema.index({ passwordResetToken: 1, passwordResetExpires: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;