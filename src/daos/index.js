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
        const URL = "mongodb+srv://ferguitarra1490:Guitarra,1490@ecommerce.vi3tez0.mongodb.net/newServer?retryWrites=true&w=majority"
        
        mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, error =>{
            if(error){
                logger.fatal(error)
            }
            logger.info('conexion exitosa');
        })

        const {ProductosDaosMongo} = await import('./products/productsMongo.js')
        const {productsSchema} = await import('../models/products.models.js')
        const {productsCollection} = await import('../models/products.models.js')
        ContenedorDaoProductos = new ProductosDaosMongo(productsCollection,productsSchema)

        const {CarritoDaosMongo} = await import('./carts/cartsMongo.js')
        const {cartsSchema} = await import('../models/carts.models.js')
        const {cartsCollection} = await import('../models/carts.models.js')
        ContenedorDaoCarritos = new CarritoDaosMongo(cartsCollection,cartsSchema)
        break;
}

export {ContenedorDaoProductos,ContenedorDaoCarritos}