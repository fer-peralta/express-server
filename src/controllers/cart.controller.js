import { getCarts, saveCart, updateCart, deleteCart, findCart } from "../services/cart.service.js";

export const getCartsController = async (req, res) => {
    try {
        const response = await getCarts();
        response ? res.status(200).send({ data: response }) : res.status(200).send({ message: `No hay turnos` })
    } catch (error) {
        res.status(400).send({ message: `Hubo un error ${error}` })
    }
}

export const saveCartController = async (req, res) => {
    try {
        const response = await saveCart(req.body);
        res.status(200).send({ data: response })
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