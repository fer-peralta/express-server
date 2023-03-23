import { getApiDao } from "../database/index.database.js";
import { config } from "../config/config.js";

const { OrderDaoContainer } = await getApiDao(config.DBTYPE)

export const getOrders = async () => {
    return await OrderDaoContainer.getAll();
}

export const saveOrder = async (data) => {
    return await OrderDaoContainer.saveData(data)
}

export const findOrder = async (id) => {
    return await OrderDaoContainer.getById(id)
}

export const updateOrder = async (id, body) => {
    return await OrderDaoContainer.updateById(id, body)
}

export const deleteOrder = async (id) => {
    return await OrderDaoContainer.deleteById(id)
}