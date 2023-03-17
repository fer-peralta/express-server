import { getApiDao } from "../database/index.database.js";
import { config } from "../config/config.js";

const { UserDaoContainer } = await getApiDao(config.DBTYPE)

export const getUsers = async () => {
    return await UserDaoContainer.getAll();
}

export const saveUser = async (data) => {
    return await UserDaoContainer.save(data)
}

export const findUser = async (id) => {
    return await UserDaoContainer.findOne(id)
}