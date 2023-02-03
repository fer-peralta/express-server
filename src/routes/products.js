import express from "express"
import { checkAdminRole } from "../middlewares/checkRole.js"
import {ContenedorDaoProductos} from "../daos/index.js"
import { checkLogin } from "../middlewares/checkLogin.js"
import { logger } from "../loggers/loggers.js"

const productosApi = ContenedorDaoProductos

const productsRouter = express.Router();

productsRouter.get('/', checkLogin, async (req, res) => {
    const response = await productosApi.getAll()
    res.status(200).json(response)
})

productsRouter.get('/:id', checkLogin, async (req, res) => {
    // const productId = parseInt(req.params.id); // * Only with fyleSystem
    const productId = req.params.id
    const response = await productosApi.getById(productId);
    res.status(200).json(response);
})

productsRouter.post('/', checkLogin, checkAdminRole, async (req, res) => {
    const response = await productosApi.save(req.body);
    logger.info("Se agregó un producto de la base de datos")
    res.status(200).json({response: response, message: "El producto fue agregado a la base de datos"})
})

productsRouter.put('/:id', checkLogin, checkAdminRole, async (req, res) => {
    // const productId = parseInt(req.params.id); // * Only with fileSystem
    const productId = req.params.id
    // const response = await productosApi.updateById(req.body, productId); // * Only with fileSystem
    const response = await productosApi.putById(productId, req.body);
    logger.info("Se actualizó un producto de la base de datos")
    res.status(200).json({response: response, message: "El producto seleccionado fue actualizado"});
})

productsRouter.delete('/:id', checkLogin, checkAdminRole, async (req, res) => {
    // const productId = parseInt(req.params.id); // * Only with fileSystem
    const productId = req.params.id
    const response = await productosApi.deleteById(productId);
    logger.info("Se eliminó un producto de la base de datos")
    res.status(200).json({response: response, message: "El producto seleccionado fue eliminado"});
})

export {productsRouter}