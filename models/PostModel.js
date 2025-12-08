import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    caption: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

const PostModel = mongoose.model("post", PostSchema);

export default PostModel;