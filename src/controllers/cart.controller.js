import { getCarts, saveCart, updateCart, deleteCart, findCart } from "../services/cart.service.js";
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
        // TODO No funciona aun
        const productInCart = cart.data.products.find(item => item._id == productId)
        const existInCart = productInCart._id == productId
        existInCart ? productToAdd.data.quantity + 1 : productToAdd.data.quantity = 1
        console.log(productToAdd.data.quantity)
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

// cartsRouter.delete('/:id', checkLogin, async (req, res) => {
//     const cartId = req.params.id
//     logger.info("Se ha borrado un carrito de compras")
//     res.status(200).json({response: await carritosApi.deleteById(cartId), message: "Se ha borrado el carrito de compras seleccionado"});
// })

// cartsRouter.get('/:id/products', checkLogin, async (req, res) => {
//     const cartId = req.params.id
//     const carritoResponse = await carritosApi.getById(cartId);
//     if(carritoResponse.error){
//         res.json(carritoResponse);
//     } else{
//         const getData = async()=>{
//             const products = await Promise.all(carritoResponse.products.map(async(element) => {
//                 const productResponse = await productosApi.getById(element);
//                 return productResponse
//             }));
//             res.status(200).json({cart: cartId,products: products});
//         }
//         getData();
//     }
// })