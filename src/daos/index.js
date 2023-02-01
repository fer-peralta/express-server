import {options} from "../config/dbConfig.js";
import mongoose from 'mongoose';

import { logger } from "../loggers/loggers.js";

let ContenedorDaoProductos;
let ContenedorDaoCarritos;

//identificador
let databaseType = "mongo";

switch(databaseType){
    case "archivos":
        const {ProductsDaoArchivos} = await import("./products/productsFiles.js");
        const {CartsDaoArchivos} = await import("./carts/cartsFiles.js");
        ContenedorDaoProductos = new ProductsDaoArchivos(options.fileSystem.pathProducts);
        ContenedorDaoCarritos = new CartsDaoArchivos(options.fileSystem.pathCarts);
        break;
    case "sql":
        const {ProductosDaoSQL} = await import("./products/productsSql.js");
        const {CarritosDaoSQL} = await import("./carts/cartsSql.js");
        ContenedorDaoProductos = new ProductosDaoSQL(options.sqliteDB, "productos");
        ContenedorDaoCarritos = new CarritosDaoSQL(options.sqliteDB,"carritos");
        break;
    case "mongo":
        const URL = "mongodb+srv://ferguitarra1490:Guitarra,1490@ecommerce.vi3tez0.mongodb.net/?retryWrites=true&w=majority"
        
        mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, error =>{
            if(error) {
                // throw new Error(`conexion fallida ${error}`)
                logger.fatal("No se pudo conectar a la base de datos")
            }
            else {
                logger.info('conexion exitosa')
            }
        })

        const {ProductosDaosMongo} = await import('./products/productsMongo.js')
        const {productosSchema} = await import('../models/mongoAtlas.js')
        const {productosCollection} = await import('../models/mongoAtlas.js')
        ContenedorDaoProductos = new ProductosDaosMongo(productosCollection,productosSchema)

        const {CarritoDaosMongo} = await import('./carts/cartsMongo.js')
        const {carritosSchema} = await import('../models/mongoAtlas.js')
        const {carritosCollection} = await import('../models/mongoAtlas.js')
        ContenedorDaoCarritos = new CarritoDaosMongo(carritosCollection,carritosSchema)
        break;
}

export {ContenedorDaoProductos,ContenedorDaoCarritos}