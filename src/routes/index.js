import express from "express"
import { loggerWarn } from "../database/logs/loggers.js"
import { productRouter } from "./api/product.route.js"

const router = express.Router()

router.use("/products", productRouter)

//* 404
router.get('/*', (req, res) => {
    loggerWarn.warn(`No se ha encontrado la ruta solicitada`)
    res.status(404).send('<h1>404! Page not found</h1>');
})

export { router as apiRouter }