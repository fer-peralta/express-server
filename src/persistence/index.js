import { UserModel } from "./models/users.model.js"
// import { ProductsModel } from "./models/products.model.js"
import { config } from "../config/config.js"
// // const chatApi = new Containersql(options.sqliteDB,"chat")
import { options } from "../config/dbConfig.js"
import { MongoClient } from "../persistence/clients/mongoClient.js"

export async function getApiDao(dbtype) {
    let UserDaoContainer
    let ProductDaoContainer
    let ChatDaoContainer

    switch (dbtype) {
        case "SQL":
            // const { ProductSqlDao } = await import("./daos/products/productsSqlDao.js")
            // const { ChatSqlDao } = await import("./daos/chat/chatsSqlDao.js")
            // ProductDaoContainer = new ProductSqlDao(options.mariaDB, "products")
            // ChatDaoContainer = new ChatSqlDao("chat.txt")
            break;
        case "MONGO":
            const client = new MongoClient()
            await client.connect()
            const { ProductSqlDao } = await import("./daos/products/productsSqlDao.js")
            const { ChatSqlDao } = await import("./daos/chat/chatsSqlDao.js")
            const { UserMongoDao } = await import("./daos/users/usersMongoDao.js")
            ProductDaoContainer = new ProductSqlDao(options.mariaDB, "products")
            ChatDaoContainer = new ChatSqlDao("chat.txt")
            // const { ProductMongoDao } = await import("./daos/products/productsMongoDao")
            UserDaoContainer = new UserMongoDao(UserModel)
            break;
        default:
            break;
    }
    return { UserDaoContainer, ProductDaoContainer, ChatDaoContainer }
}

