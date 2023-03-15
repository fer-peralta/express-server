
import express from "express"
import { getProductsController, findProductController, saveProductController, updateProductController, deleteProductController } from "../../controllers/product.controller.js"

const router = express.Router()

router.get('/', getProductsController)

router.get('/:id', findProductController)

router.post('/', saveProductController)

router.put('/:id', updateProductController)

router.delete('/:id', deleteProductController)

export { router as productRouter }