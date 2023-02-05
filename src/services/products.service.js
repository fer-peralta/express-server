import { productApi } from "../persistence/index.js"

export const getProducts = async() =>{
    return await productApi.getAll()
}