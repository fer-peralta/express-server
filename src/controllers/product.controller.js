import { getProducts, saveProduct, findProduct, updateProduct, deleteProduct } from "../services/product.service.js";

export const getProductsController = async (req, res) => {
    try {
        const response = await getProducts();
        response ? res.status(200).send({ data: response }) : res.status(200).send({ message: `No hay turnos` })
    } catch (error) {
        res.status(400).send({ message: `Hubo un error ${error}` })
    }
}

export const saveProductController = async (req, res) => {
    try {
        const response = await saveProduct(req.body);
        res.status(200).send({ data: response })
    } catch (error) {
        res.status(400).send({ message: `Hubo un error ${error}` })
    }
}

export const findProductController = async (req, res) => {
    try {
        const response = await findProduct(req.params.id);
        res.status(200).json({ data: response })
    } catch (error) {
        res.status(400).json({ message: `Hubo un error ${error}` })
    }
}

export const updateProductController = async (req, res) => {
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
        const response = await updateProd(req.params.id, req.body);
        res.status(200).send({ data: [response, `Se ha actualizado el turno con exito`] })
    } catch (error) {
        res.status(400).send({ message: `Hubo un error ${error}` })
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const response = await deleteProduct(req.params.id);
        res.status(200).json({ data: response })
    } catch (error) {
        res.status(400).json({ message: `Hubo un error ${error}` })
    }
}