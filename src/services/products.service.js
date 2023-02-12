import { getApiDao } from "../persistence/index.js";
import { config } from "../config/config.js";

const { ProductDaoContainer } = await getApiDao(config.DBTYPE)

export const getProducts = async () => {
    return await ProductDaoContainer.getAll()
}

export const getProductsById = async (id) => {
    return await ProductDaoContainer.getById(id)
}

export const saveProduct = async (newProduct) => {
    return await ProductDaoContainer.save(newProduct)
}