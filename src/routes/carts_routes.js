const express = require("express")
const router = express.Router()

const Container = require("../Container")
const cartList = new Container("src/file_cart.txt")

// * Carts routes

// * Show the products of the cart
router.get("/:id/products", async(request, response)=>{
    const {id} = request.params
    const cartSelected = await cartList.getById(parseInt(id))
    console.log(`Se envió el contenido del carrito ${id}`)
    response.send(cartSelected)  
})

// * Create a cart and return his id
router.post("/", async(request, response)=>{
    const newCart = await cartList.newCart()
    console.log("Un carrito fue creado")    
    response.send(newCart)
})

// * Delete the cart
router.delete("/:id", async(request, response)=>{
    const {id}= request.params
    await cartList.deleteById(id)
    console.log(`Se eliminó el carrito ${id}`)
    response.send(`Se eliminó el carrito ${id}`)
})

// * Delete an element of the cart
router.delete("/:id/products/:id_prod", async(request, response)=>{
    const {id, id_prod} = request.params
    const productSelected = await cartList.deleteCartProduct(id, id_prod)
    response.send(productSelected)
})

// * Adding products to the cart
router.post("/:id/products", async(request, response)=>{
    const {id} = request.params
    const productToAdd = request.body
    const cartUpdated = await cartList.addCartProduct(id, productToAdd)
    console.log(cartUpdated)
    response.send(cartUpdated)
})

module.exports = router