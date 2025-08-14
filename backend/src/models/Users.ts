import mongoose, { Schema, Document } from "mongoose";
import {Iuser} from "../Interface"

// document {} converts iusermodel to a mongoose document with all its builtin methods
export interface IUserModel extends Iuser, Document {}
//schema
const UserSchema = new Schema<IUserModel>({

    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

// exporting the model
const User = mongoose.model<IUserModel>("User", UserSchema);
export default User;
