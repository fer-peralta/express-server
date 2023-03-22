import mongoose from "mongoose"

const cartCollection = "carts"

mongoose.set('strictQuery', true)

const cartsSchema = new mongoose.Schema({
    products: [{
        name: { type: String, required: true, minLength: 2 },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        url: { type: String, required: true },
    }]
    }
    ,
    { timestamps: true }
)

export const CartModel = mongoose.model(cartCollection, cartsSchema)