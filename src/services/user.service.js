import { getApiDao } from "../database/index.database.js";
import { config } from "../config/config.js";

const { UserDaoContainer } = await getApiDao(config.DBTYPE)

export const getUsers = async () => {
    return await UserDaoContainer.getAll();
}

export const saveUser = async (data) => {
    return await UserDaoContainer.saveData(data)
}

export const findUser = async (id) => {
    return await UserDaoContainer.getById(id)
}

export const updateUser = async (id) => {
    return await UserDaoContainer.updateById(id)
}

export const deleteUser = async (id) => {
    return await UserDaoContainer.deleteById(id)
}