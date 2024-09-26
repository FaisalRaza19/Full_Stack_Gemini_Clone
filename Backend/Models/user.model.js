import mongoose from "mongoose";
import {chatHistory} from "./History.model.js"

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
            index: true,
        },
        userName: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        chatHistory: [chatHistory],
        avatar: {
            type: String,
        },
        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true,
    },
);

export const User = mongoose.model("User", userSchema);