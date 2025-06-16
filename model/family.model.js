import mongoose from 'mongoose';

const familySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: {
          type: String,
          enum: ['admin', 'viewer'],
          default: 'viewer',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['approved', 'pending'],
          default: 'approved',
        },
      },
    ],
    memories: {
      type: [mongoose.Schema.Types.ObjectId], // Array of Media references
      ref: 'Media', // Reference to Media model
      default: [] // Initialize as empty array
    },
    joinPolicy: {
      type: String,
      enum: ['auto', 'approval'],
      default: 'approval',
    },
    theme: {
      type: String,
      default: 'default',
    },
    vaults: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vault',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Family', familySchema);
