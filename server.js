const express = require("express")
const Container = require("./index")

const app = express()

const products = new Container("file.txt")

//Server up
app.listen(8080, ()=>{
    console.log("Server listening in 8080")
})

//routes
app.get("/", (request, response)=>{
    response.send("Hola desde express")
})

app.get("/products", async(request, response)=>{
    const list = await products.getAll();
    response.send(list);
})

app.get("/productRandom", async(request, response)=>{
    const list = await products.getAll();
    const selectedProduct = parseInt(Math.random()*list.length)
    const product = list[selectedProduct]
    response.send(product)
})
