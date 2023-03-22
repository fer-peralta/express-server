
import express from "express"
import * as CartController from "../../controllers/cart.controller.js"
import { checkLogin } from "../middlewares/checkLogin.js"

const router = express.Router()

router.get('/', checkLogin, CartController.getCartsController)

router.get('/:id', checkLogin, CartController.findCartController)

router.get('/:id/products', checkLogin, CartController.findCartController)

router.get('/:id/products/:productId', checkLogin, CartController.findCartController)

router.post('/', checkLogin, CartController.saveCartController)

router.post('/:id/products/:productId', checkLogin, CartController.saveProductToCartController)

router.delete('/:id', checkLogin, CartController.deleteCartController)

router.delete('/:id/products/:productId', checkLogin, CartController.deleteProductInCartController)

export { router as cartRouter }