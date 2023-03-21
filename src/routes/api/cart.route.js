
import express from "express"
import { getCartsController, findCartController, saveCartController, updateCartController, deleteCartController, saveProductToCartController } from "../../controllers/cart.controller.js"
import { checkLogin } from "../middlewares/checkLogin.js"

const router = express.Router()

router.get('/', checkLogin, getCartsController)

router.get('/:id', checkLogin, findCartController)

router.get('/:id/products', checkLogin, findCartController)

router.get('/:id/products/:productId', checkLogin, findCartController)

router.post('/', checkLogin, saveCartController)

router.post('/:id/products/:productId', checkLogin, saveProductToCartController)

router.put('/:id', checkLogin, updateCartController)

router.delete('/:id', checkLogin, deleteCartController)

router.post('/checkout', checkLogin, saveCartController)

export { router as cartRouter }