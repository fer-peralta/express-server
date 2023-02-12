import { getApiDao } from "../persistence/index.js";
import { config } from "../config/config.js";

const { UserDaoContainer } = await getApiDao(config.DBTYPE)


export const getUsers = async () => {
    return await UserDaoContainer.getAll();
}

export const saveUser = async (body) => {
    return await UserDaoContainer.save(body)
}

export const findUser = async (body) => {
    return await UserDaoContainer.findOne(body)
}