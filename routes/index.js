const express = require("express")
const router = express.Router()

const Container = require("../Container")
const Product = require("../Product")

const productsList = new Container("file.txt")

router.get("/", (req, res) =>{
   res.render("./pages/home")
})

router.get("/products", async(req, res) =>{
    const products = await productsList.getAll()
    console.log(products)
    res.render("./pages/products", {products: products})
})

router.post("/products", async(req, res) =>{
    const newProduct = req.body
    const productToAdd = new Product(newProduct.title, newProduct.price, newProduct.thumbnail)
    console.log(productToAdd)
    await productsList.save(productToAdd)
    res.redirect("/")
})

module.exports = router