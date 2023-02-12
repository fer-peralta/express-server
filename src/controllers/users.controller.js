import { getUsers, saveUser, findUser } from "../services/users.service.js";

export const getUsersController = async (req, res) => {
    try {
        const response = await getUsers();
        return response
    } catch (error) {
        return { message: `Hubo un error ${error}` }
    }
}

export const saveUserController = async (req, res) => {
    try {
        const response = await saveUser(req.body);
        return ({ data: response });
    } catch (error) {
        return { message: `Hubo un error ${error}` }
    }
}

export const verifyUser = async (req, res) => {
    try {
        const response = await findUser(req.body);
        return ({ data: response });
    } catch (error) {
        return { message: `Hubo un error ${error}` }
    }
}