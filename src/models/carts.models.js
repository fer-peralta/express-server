import mongoose from "mongoose";

const cartsCollection = "carts"

const cartsSchema = new mongoose.Schema({
    products:{
        type:Array,
        required: true
    }
},
{timestamps:true}
)

export {cartsCollection,cartsSchema}