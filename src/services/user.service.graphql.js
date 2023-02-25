import { getApiDao } from "../persistence/index.js";
import { config } from "../config/config.js";

const { UserDaoContainer } = await getApiDao(config.DBTYPE)

export const root = {
    getUsers: async () => {
        return await UserDaoContainer.getAll();
    },

    addUser: async ({ user }) => {
        return await UserDaoContainer.save(user)
    },

    getUserById: async (body) => {
        return await UserDaoContainer.findOne(body)
    }

}
