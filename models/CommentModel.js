import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
},{
    timestamps: true
});

const CommentModel = mongoose.model("comment", CommentSchema);

export default CommentModel;