const express = require("express")
const router = express.Router()

const Container = require("../Container")
const Product = require("../Product")

const productsList = new Container("./src/file.txt")

router.get("/", async(req, res) =>{
   res.render("home", {productsList: await productsList.getAll()})
})

router.get("/products", async(req, res) =>{
    res.render("products", {productsList: await productsList.getAll()})
})

router.post("/products", async(req, res) =>{
    const newProduct = req.body
    const productToAdd = new Product(newProduct.title, newProduct.price, newProduct.thumbnail)
    await productsList.save(productToAdd)
    console.log("Se agregó el siguiente producto: \n\r", productToAdd)
    res.redirect("/")
})

module.exports = router