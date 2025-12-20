import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // pastikan sesuai dengan nama model user
    required: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  // ✅ field tambahan untuk status post
  isPosted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const ProgressModel = mongoose.model("progress", ProgressSchema);

export default ProgressModel;