import mongoose from "mongoose";

const userCollection = "users"

mongoose.set('strictQuery', true)

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    adress: { type: String },
    age: { type: Number, required: true },
    telephone: { type: String, required: true },
    avatar: { type: String, required: true },
    cart: { type: Object },
    order: { type: Object }
},
    { timestamps: true }
)

export const UserModel = mongoose.model(userCollection, userSchema)