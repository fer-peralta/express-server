import { getUsers, saveUser, findUser } from "../service/user.service.js";

export const getUsersController = async (req, res) => {
    try {
        const response = await getUsers();
        res.json({ data: response });
    } catch (error) {
        res.json({ message: `Hubo un error ${error}` });
    }
}

export const saveUserController = async (req, res) => {
    try {
        const response = await saveUser(req.body);
        res.json({ data: response });
    } catch (error) {
        res.json({ message: `Hubo un error ${error}` });
    }
}

export const verifyUser = async (req, res) => {
    try {
        const response = await findUser(req.body);
        res.json({ data: response });
    } catch (error) {
        res.json({ message: `Hubo un error ${error}` });
    }
}