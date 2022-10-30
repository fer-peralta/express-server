const express = require("express")
const router = express.Router()

const Container = require("../Container")
const Product = require("../Product")

const productsList = new Container("src/file.txt")

// * Role verification
// ? To change te role just change admin to true

let admin = true

const roleVerification = (req,res,next) =>{
    if(admin === true){
        console.log("Usuario autorizado")
        next()
    } else{
        res.send('No tiene permiso para acceder a esa ruta')
    }
}

// * Products routes

// * Get all elements
router.get("/", async(request, response)=>{
    const list = await productsList.getAll();
    response.send(list);
})

// * Get an element by id
router.get("/:id", async(request, response)=>{
    const {id} = request.params
    const productSelected = await productsList.getById(parseInt(id))

    if(productSelected){
        response.send(productSelected)
    }
    else {
        response.send({error: "Producto no encontrado"})
    }    
})

// * Add an element to the list ONLY FOR ADMIN
router.post("/", roleVerification, async(request, response)=>{
    const newProduct = request.body
    const productToAdd = new Product(newProduct.name, newProduct.price, newProduct.url, newProduct.stock, newProduct.description)
    console.log(productToAdd)
    await productsList.save(productToAdd)
    response.send(productToAdd)
})

// * Update an element ONLY FOR ADMIN
router.put("/:id", roleVerification, async(request, response)=>{
    const {id} = request.params
    newInfo = request.body
    await productsList.updateById(parseInt(id), newInfo)
    response.send("Producto Actualizado")
})

// * Delete an element ONLY FOR ADMIN
router.delete("/:id", roleVerification, async(request, response)=>{
    const {id} = request.params
    await productsList.deleteById(id)
    response.send("El producto fue eliminado")
})

module.exports = router