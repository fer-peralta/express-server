import mongoose from 'mongoose'

const orderCollection = 'orders'

mongoose.set('strictQuery', true)

const orderSchema = new mongoose.Schema({
    username: { type: String, required: true },
    userId: { type: String, required: true },
    cart: [{
        id: String,
        name: String,
        price: Number,
        quantity: Number
    }],
    total: { type: Number, required: true },
    state: { type: String, default: 'generada', required: true }
},
    { timestamps: true }
)

export const OrderModel = mongoose.model(orderCollection, orderSchema)
