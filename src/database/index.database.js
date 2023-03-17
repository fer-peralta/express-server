import { options } from "../config/dbConfig.js"
import { MongoClient } from "./clients/mongo.client.js"

import { ProductModel } from "./models/product.model.js"
import { CartModel } from "./models/cart.model.js"
import { UserModel } from "./models/user.model.js"

export const getApiDao = async (dbType) => {

    let ProductDaoContainer
    let CartDaoContainer
    let UserDaoContainer

    switch (dbType) {
        case "FILESYSTEM":
            const { ProductsDaoArchivos } = await import("./products/productsFiles.js")
            const { CartsDaoArchivos } = await import("./carts/cartsFiles.js")
            ContenedorDaoProductos = new ProductsDaoArchivos(options.fileSystem.pathProducts)
            ContenedorDaoCarritos = new CartsDaoArchivos(options.fileSystem.pathCarts)
            break
        case "MYSQL":
            const { ProductosDaoSQL } = await import("./products/productsSql.js")
            const { CarritosDaoSQL } = await import("./carts/cartsSql.js")
            ContenedorDaoProductos = new ProductosDaoSQL(options.sqliteDB, "productos")
            ContenedorDaoCarritos = new CarritosDaoSQL(options.sqliteDB, "carritos")
            break
        case "MONGO":
            const client = new MongoClient()
            await client.connect()

            const { ProductMongoDao } = await import("./daos/product/product.dao.mongo.js")
            ProductDaoContainer = new ProductMongoDao(ProductModel)
            const { CartMongoDao } = await import("./daos/cart/cart.dao.mongo.js")
            CartDaoContainer = new CartMongoDao(CartModel)
            const { UserMongoDao } = await import("./daos/user/user.dao.mongo.js")
            UserDaoContainer = new UserMongoDao(UserModel)
            break
    }
    return { ProductDaoContainer, CartDaoContainer, UserDaoContainer }
}