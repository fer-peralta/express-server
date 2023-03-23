import express from "express"
import * as CheckoutController from "../../controllers/checkout.controller.js"
import { checkLogin } from "../middlewares/checkLogin.js"
import { checkCart } from "../middlewares/checkCart.middleware.js"

const router = express.Router()

router.get('/', checkLogin, checkCart, CheckoutController.createOrderController)

router.post('/:id', checkLogin, CheckoutController.sendOrderController)

export { router as checkoutRouter }