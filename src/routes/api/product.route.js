
import express from "express"
import * as ProductController from "../../controllers/product.controller.js"
import { checkLogin } from "../middlewares/checkLogin.js"
import { checkAdminRole } from "../middlewares/checkRole.js"

const router = express.Router()

router.get('/', checkLogin, ProductController.getProductsController)

router.get('/:id', checkLogin, ProductController.findProductController)

router.post('/', checkLogin, checkAdminRole, ProductController.saveProductController)

router.put('/:id', checkLogin, checkAdminRole, ProductController.updateProductController)

router.delete('/:id', checkLogin, checkAdminRole, ProductController.deleteProductController)

export { router as productRouter }