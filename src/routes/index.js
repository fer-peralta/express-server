import express from "express"
import { ProductRouter } from "./api/products.routes.js"
import { InfoRouter } from "./api/info.routes.js"
import { UserRouter } from "./api/users.routes.js"
import { logArchivoWarn } from "../logger.js"
import { productApi } from "../persistence/index.js"
import handlebars from "express-handlebars"

const router = express.Router()


router.use("/products",ProductRouter)
router.use("/info",InfoRouter)
router.use("/users",UserRouter)

router.get('/*', async(req,res)=>{
    logArchivoWarn.warn('No se encontró la ruta')
    res.status(404).send('<h1>404! Page not found</h1>');
})

export {router as apiRouter}