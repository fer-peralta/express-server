import mongoose from "mongoose"

const cartCollection = "carts"

mongoose.set('strictQuery', true)

const cartsSchema = new mongoose.Schema({
    products: {
        type: Array,
        required: true
    }
},
    { timestamps: true }
)

export const CartModel = mongoose.model(cartCollection, cartsSchema)