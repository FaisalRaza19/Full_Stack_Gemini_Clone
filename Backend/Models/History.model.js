import mongoose from 'mongoose';

export const chatHistory = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    queries: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
