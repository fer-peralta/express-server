import express from 'express'
import { getProducts, getProductsById, saveProduct } from '../../services/products.service.js';
import { logger } from '../../logger.js';

const router = express.Router();

router.get('/',async(req,res)=>{
    try{
        const response = await getProducts()
        res.render("partials/products",{products: response})
        // res.status(200).send({data: response});
    }
    catch(error) {
        res.json({message: `Hubo un error ${error}`})
    }
})

router.get('/:id',async(req,res)=>{
    try{
        const response = await getProductsById(parseInt(req.params.id))
        if(response){
            return res.send(response)
        } 
    }
    catch(error){
        return res.send(`Hubo un error: ${error}`)
    }
})

router.post('/',async(req,res)=>{
    try{
        const newProduct = await saveProduct(req.body);
        logger.info(`Se ha añadido un nuevo producto a la base de datos`)
        return res.send(newProduct)
    }
    catch(error){
        return res.send(`Hubo un error: ${error}`)
    }
})

// router.put('/:id',async(req,res)=>{
//     try{
//         const result = await productosApi.updateById(parseInt(req.params.id),req.body);
//         res.send(result);
//     }
//     catch(error){
//         return res.send(`Hubo un error: ${error}`)
//     }
// })

// router.delete('/:id',async(req,res)=>{
//     try{
//         const result = await productosApi.deleteById(parseInt(req.params.id));
//         res.send(result);
//     }
//     catch(error){
//         return res.send(`Hubo un error: ${error}`)
//     }
// })

// ? --------------------------------------

export {router as ProductRouter}