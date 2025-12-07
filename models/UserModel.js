import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

const UserModel = mongoose.model("users", UserSchema)

export default UserModel;