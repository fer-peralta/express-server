import express from "express";
import {ContenedorDaoProductos, ContenedorDaoCarritos} from "../daos/index.js"
import { logger } from "../loggers/loggers.js";
import { checkLogin } from "../middlewares/checkLogin.js"

const cartsRouter = express.Router()

const productosApi = ContenedorDaoProductos
const carritosApi = ContenedorDaoCarritos

cartsRouter.get('/', checkLogin, async (req, res) => {
    const response = await carritosApi.getAll();
    res.status(200).json(response);
})

cartsRouter.post('/', checkLogin, async (req, res) => {
    const response = await carritosApi.save({ products: [], timestamp: new Date().toLocaleDateString() });
    logger.info("Se ha creado un carrito de compras")
    res.status(200).json(response);
})

cartsRouter.delete('/:id', checkLogin, async (req, res) => {
    const cartId = req.params.id
    logger.info("Se ha borrado un carrito de compras")
    res.status(200).json({response: await carritosApi.deleteById(cartId), message: "Se ha borrado el carrito de compras seleccionado"});
})

cartsRouter.get('/:id/products', checkLogin, async (req, res) => {
    const cartId = req.params.id
    const carritoResponse = await carritosApi.getById(cartId);
    if(carritoResponse.error){
        res.json(carritoResponse);
    } else{
        const getData = async()=>{
            const products = await Promise.all(carritoResponse.products.map(async(element) => {
                const productResponse = await productosApi.getById(element);
                return productResponse
            }));
            res.status(200).json({cart: cartId,products: products});
        }
        getData();
    }
})

cartsRouter.post('/:id/products/:productid', checkLogin, async (req, res) => {
    const cartId = req.params.id
    const productId = req.params.productid
    const carritoResponse = await carritosApi.getById(cartId);
    if(carritoResponse.error){
        res.json({message:`El carrito con id: ${cartId} no fue encontrado`});
    } else{
        const productoResponse = await productosApi.getById(productId);
        if(productoResponse.error){
            res.json(productoResponse);
        } else{
            carritoResponse.products.push(productoResponse);
            const response = await carritosApi.putById(cartId, carritoResponse);
            res.status(200).json({product:productoResponse, cart: cartId, message:"Se agregó el producto seleccionado en el carrito de compras seleccionado"});
        }
    }
})

cartsRouter.delete('/:id/products/:productid', checkLogin, async (req, res) => {
    const cartId = req.params.id
    const productId = req.params.productid
    
    const carritoResponse = await carritosApi.getById(cartId);
    if(carritoResponse.error){
        res.json({message:`El carrito con id: ${cartId} no fue encontrado`});
    } else{
        const productToDelete = await carritosApi.deleteOneProd(cartId, productId);
        if (productToDelete) {
            res.status(200).json({message:"product deleted"});
        } else{
            res.status(200).json({message:`El producto ${productId} no se encontro en el carrito ${cartId}`});
        }
    }
})

export {cartsRouter}