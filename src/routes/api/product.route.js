
import express from "express"
import { getProductsController, findProductController, saveProductController, updateProductController, deleteProductController } from "../../controllers/product.controller.js"
import { checkLogin } from "../middlewares/checkLogin.js"
import { checkAdminRole } from "../middlewares/checkRole.js"

const router = express.Router()

router.get('/', checkLogin, getProductsController)

router.get('/:id', checkLogin, findProductController)

router.post('/', checkLogin, checkAdminRole, saveProductController)

router.put('/:id', checkLogin, checkAdminRole, updateProductController)

router.delete('/:id', checkLogin, checkAdminRole, deleteProductController)

export { router as productRouter }