import { getCarts, saveCart, updateCart, deleteCart, findCart } from "../services/cart.service.js";
import { findProduct } from "../services/product.service.js"
// import { findUser } from "../services/user.service.js";

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
        const userId = req.user.id
        req.user.cart = response
        const update = { cart: response }
        const userUpdate = await findUser({ _id: userId }, update)
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
        const productToAdd = await findProduct(productId)
        cart.data.products.push(productToAdd.data)
        const response = await updateCart(cartId, cart.data)
        res.status(200).json({ message: `Se agregó el producto ${productToAdd.data.name} id: ${productId} en el carrito de compras ${cartId}, correspondiente al usuario ${req.user.name} id: ${userId}`, cart: response.newData.data })
    } catch (error) {
        res.status(400).send({ message: `Hubo un error ${error}` })
    }
}

export const findCartController = async (req, res) => {
    try {
        const response = await findCart(req.params.id);
        res.status(200).json({ data: response })
    } catch (error) {
        res.status(400).json({ message: `Hubo un error ${error}` })
    }
}

export const updateCartController = async (req, res) => {
    // const {id} = params
    // const modificacion = body
    try {
        // const existe = await getProdById(id)

        // if (!existe){
        //     return res.status(404).send({ message: 'Error el producto no existe' })
        // } else{
        //     const prod = await updateProd(id,modificacion)
        //     return res.status(200).send(prod)
        // }
        const response = await updateCart(req.params.id, req.body);
        res.status(200).send({ data: [response, `Se ha actualizado el turno con exito`] })
    } catch (error) {
        res.status(400).send({ message: `Hubo un error ${error}` })
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

// TODO no funciona aun
export const deleteProductInCartController = async (req, res) => {
    try {
        const response = await deleteCart(req.params.id);
        const cartId = req.params.id
        const productId = req.params.productId
        const userId = req.user.id
        res.status(200).json({ data: response })
    } catch (error) {
        res.status(400).json({ message: `Hubo un error ${error}` })
    }
}

// cartsRouter.delete('/:id/products/:productid', checkLogin, async (req, res) => {
//     const {id, id_prod} = req.params
//     const existe = await carritosApi.getById(id)

//     if(!existe){
//         return res.status(404).send({ message: 'Error el carrito no existe' })
//     }else{
//         const carrito = await carritosApi.deleteOneProd(id, id_prod)
//         res.send(carrito)
//     }
// })