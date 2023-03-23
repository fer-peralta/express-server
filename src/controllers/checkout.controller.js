import { loggerError } from "../database/logs/loggers.js";
import { findCart } from "../services/cart.service.js";
import * as checkoutService from "../services/checkout.service.js"
import { adminOrderWPSend } from "../messages/whatsapps/adminOrder.whatsapp.js";
import { adminOrderEmailSend } from "../messages/emails/adminOrder.email.js";
import { userOrderSMSSend } from "../messages/sms/userOrder.sms.js";

export const createOrderController = async (req, res) => {
    try {
        const userId = req.user._id
        const cart = await findCart(req.user.cart._id)
        const productsInCart = cart.data.products
        const adjustedPrices = productsInCart.map(item => item.price * item.quantity)
        const totalPrice = Number(adjustedPrices.reduce((acc, curr) => acc + curr, 0))
        const newOrder = {
            username: req.user.username,
            userId: userId,
            cart: productsInCart,
            total: totalPrice,
            state: "generated"
        }
        const orderGenerated = await checkoutService.saveOrder(newOrder)
        const order = await checkoutService.findOrder(orderGenerated.id)
        res.status(200).send(order)
    } catch (error) {
        const errorMessage = { message: `There was an error: ${error}` }
        loggerError.error(errorMessage)
        res.status(400).json(errorMessage)
    }
}

export const sendOrderController = async (req, res) => {
    try {
        const { data } = await checkoutService.findOrder(req.params.id)
        data.state = 'in process'
        const { newData } = await checkoutService.updateOrder(req.params.id, data)
        adminOrderWPSend(req.user)
        adminOrderEmailSend(req.user, newData)
        userOrderSMSSend(req.user)
        res.status(200).send(newData.data)
    } catch (error) {
        const errorMessage = { message: `There was an error: ${error}` }
        loggerError.error(errorMessage)
        res.status(400).json(errorMessage)
    }
}