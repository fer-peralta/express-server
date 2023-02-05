import { productApi } from "../persistence/index.js"

export const getProducts = async() =>{
    return await productApi.getAll()
}

export const getProductsById = async(id) =>{
    return await productApi.getById(id)
}

export const saveProduct = async(newProduct) =>{
    return await productApi.save(newProduct)
}