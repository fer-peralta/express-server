const express = require('express');
const ContenedorSql = require("../managers/Containersql");
const options = require("../config/dbConfig");

const {Cookie} = require("express-session")
const session = require("express-session")
const MongoStore = require ('connect-mongo')

const router = express.Router();

const productosApi = new ContenedorSql(options.mariaDB, "products");

router.get('/',async(req,res)=>{
    const productos = await productosApi.getAll();
    res.send(productos);
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

// * Session and cookies routes

router.get('/login',(req,res)=>{
    
    const {userName, password} = req.query
    if(req.session.userName){
        res.redirect('./perfil')
    }else{
        if(userName){
            req.session.userName = userName
            res.render('form',{userName})
        }else{
            res.render('login')
        }
    }
    
})

const checkUser = (req,res,next)=>{
    if(req.session.userName){
        console.log(req.session.userName);
        next()
    }else{
        res.redirect('./login')
    }
}


router.get('/perfil',checkUser,(req,res)=>{
    res.render('form',{userName:req.session.userName})
})

router.get('/logout',(req,res)=>{
    req.session.destroy()
    setTimeout(()=>{
            res.redirect('./login')
    },3000)
})

module.exports = router