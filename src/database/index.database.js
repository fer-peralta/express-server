import { options } from "../config/dbConfig.js"
import { MongoClient } from "./clients/mongo.client.js"

import { ProductModel } from "./models/product.model.js"
import { CartModel } from "./models/cart.model.js"
import { UserModel } from "./models/user.model.js"
import { OrderModel } from "./models/order.model.js"

export const getApiDao = async (dbType) => {

    let ProductDaoContainer
    let CartDaoContainer
    let UserDaoContainer
    let OrderDaoContainer

    switch (dbType) {
        case "MONGO":
            const client = new MongoClient()
            await client.connect()

            const { ProductMongoDao } = await import("./daos/product/product.dao.mongo.js")
            ProductDaoContainer = new ProductMongoDao(ProductModel)
            const { CartMongoDao } = await import("./daos/cart/cart.dao.mongo.js")
            CartDaoContainer = new CartMongoDao(CartModel)
            const { UserMongoDao } = await import("./daos/user/user.dao.mongo.js")
            UserDaoContainer = new UserMongoDao(UserModel)
            const { OrderMongoDao } = await import("./daos/order/order.dao.mongo.js")
            OrderDaoContainer = new OrderMongoDao(OrderModel)
            break
    }
    return { ProductDaoContainer, CartDaoContainer, UserDaoContainer, OrderDaoContainer }
}