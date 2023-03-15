import { getApiDao } from "../database/index.database.js";
import { config } from "../config/config.js";

const { ProductDaoContainer } = await getApiDao(config.DBTYPE)

export const saveProduct = async (data) => {
    return await ProductDaoContainer.saveData(data)
}

export const getProducts = async () => {
    return await ProductDaoContainer.getAll();
}

export const findProduct = async (id) => {
    return await ProductDaoContainer.getById(id)
}

export const updateProduct = async (id, body) => {
    return await ProductDaoContainer.updateById(id, body)
}

export const deleteProduct = async (id) => {
    return await ProductDaoContainer.deleteById(id)
}