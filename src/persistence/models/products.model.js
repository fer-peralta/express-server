import mongoose from 'mongoose'

const productsCollection = 'products'

mongoose.set('strictQuery', true)

const productsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    url: { type: String, required: true }
})

export const ProductsModel = mongoose.model(productsCollection, productsSchema)