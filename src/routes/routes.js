const express = require("express")
const router = express.Router()

const products = []
const messages = []

router.get("/", (req, res) =>{
   res.render("home", {products})
})

router.get("/chat", (req,res)=>{
    res.render("chat",{messages})
})

module.exports = {
    router,
    products,
    messages
}