import { getApiDao } from "../database/index.database.js";
import { config } from "../config/config.js";

const { CartDaoContainer } = await getApiDao(config.DBTYPE)

export const saveCart = async (data) => {
    return await CartDaoContainer.saveData(data)
}

export const getCarts = async () => {
    return await CartDaoContainer.getAll();
}

export const findCart = async (id) => {
    return await CartDaoContainer.getById(id)
}

export const updateCart = async (id, body) => {
    return await CartDaoContainer.updateById(id, body)
}

export const deleteCart = async (id) => {
    return await CartDaoContainer.deleteById(id)
}