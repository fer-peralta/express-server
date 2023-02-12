import mongoose from 'mongoose'

const usersCollection = 'users'

mongoose.set('strictQuery', true)

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
})

export const UserModel = mongoose.model(usersCollection, userSchema)