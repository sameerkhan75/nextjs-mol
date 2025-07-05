import mongoose from 'mongoose';

const userLocationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  game: {
    type: String,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  isOnline: {
    type: Boolean,
    default: true,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  level: {
    type: Number,
    default: 1,
  },
  achievements: [{
    type: String,
  }],
  deviceInfo: {
    userAgent: String,
    platform: String,
  },
}, {
  timestamps: true,
});

// Index for geospatial queries
userLocationSchema.index({ location: '2dsphere' });

export const UserLocation = mongoose.models.UserLocation || mongoose.model('UserLocation', userLocationSchema); 