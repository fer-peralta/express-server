import { CartModel } from "../database/models/cart.model.js";
import { UserModel } from "../database/models/user.model.js";
import { getCarts, saveCart, deleteCart, findCart } from "../services/cart.service.js";
import { findProduct } from "../services/product.service.js"
import { findUser } from "../services/user.service.js";

export const getCartsController = async (req, res) => {
    try {
        const response = await getCarts();
        response ? res.status(200).send({ data: response }) : res.status(200).send({ message: `No hay carritos` })
    } catch (error) {
        res.status(400).send({ message: `Hubo un error ${error}` })
    }
}

export const saveCartController = async (req, res) => {
    try {
        const response = await saveCart();
        const { data } = await findCart(response.id)
        const userId = req.user.id
        const update = { cart: data }
        const userUpdate = await UserModel.findOneAndUpdate({ _id: userId }, update)
        console.log(await findUser({ _id: userId }))
        res.status(200).send({ message: `A new cart was added to the user ${req.user.name} with the id ${req.user._id}`, data: userUpdate.data, cart: response.id })
    } catch (error) {
        res.status(400).send({ message: `Hubo un error ${error}` })
    }
}

export const saveProductToCartController = async (req, res) => {
    try {
        const cartId = req.params.id
        const productId = req.params.productId
        const userId = req.user.id
        const cart = await findCart(cartId)
        const productExist = cart.data.products.find(({ _id }) => _id == productId)
        let newProductToAdd = {}
        const productSearched = await findProduct(productId)
        if (productExist) {
            newProductToAdd = {
                quantity: productExist.quantity++,
            }
        } else {
            newProductToAdd = {
                _id: productSearched.data._id,
                name: productSearched.data.name,
                price: productSearched.data.price,
                quantity: 1,
                url: productSearched.data.url,
            }
            cart.data.products.push(newProductToAdd)
        }
        const response = await updateCart(cartId, cart.data)
        res.status(200).json({ message: `Se agregó un producto con el id: ${productId} en el carrito de compras ${cartId}, correspondiente al usuario ${req.user.name}, id: ${userId}`, cart: response.newData.data })
    } catch (error) {
        res.status(400).send({ message: `Hubo un error ${error}` })
    }
}

export const findCartController = async (req, res) => {
    try {
        const response = await findCart(req.params.id);
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ message: `Hubo un error ${error}` })
    }
}

export const deleteCartController = async (req, res) => {
    try {
        const response = await deleteCart(req.params.id);
        res.status(200).json({ data: response })
    } catch (error) {
        res.status(400).json({ message: `Hubo un error ${error}` })
    }
}

export const deleteProductInCartController = async (req, res) => {
    try {
        const cartId = req.params.id
        const productId = req.params.productId
        await CartModel.findOneAndUpdate(
            { _id: cartId },
            { $pull: { products: { _id: productId } } },
            { safe: true, multi: false }
        )
        return res.status(200).json({ message: "Product Deleted Successfully" });
    } catch (error) {
        res.status(400).json({ message: `Hubo un error ${error}` })
    }
}