import express from 'express'
import { getProducts } from '../../services/products.service.js';

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
    const productId = req.params.id;
    const product = await productosApi.getById(parseInt(productId));
    if(product){
        return res.send(product)
    } else{
        return res.send({error : 'producto no encontrado'})
    }
})

router.post('/',async(req,res)=>{
    const newProduct = req.body;
    const result = await productosApi.save(newProduct);
    res.send(result);
})

router.put('/:id',async(req,res)=>{
    const cambioObj = req.body;
    const productId = req.params.id;
    const result = await productosApi.updateById(parseInt(productId),cambioObj);
    res.send(result);
})

router.delete('/:id',async(req,res)=>{
    const productId = req.params.id;
    const result = await productosApi.deleteById(parseInt(productId));
    res.send(result);
})

// ? --------------------------------------

export {router as ProductRouter}