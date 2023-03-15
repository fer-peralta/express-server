import mongoose from "mongoose"

const productCollection = "products"

mongoose.set('strictQuery', true)

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, minLength: 2 },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    url: { type: String, required: true }
},
    { timestamps: true }
)

export const ProductModel = mongoose.model(productCollection, productSchema)