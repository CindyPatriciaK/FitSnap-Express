import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
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
    }
}, {
    timestamps: true
});

const ProgressModel = mongoose.model("progress", ProgressSchema);

export default ProgressModel;