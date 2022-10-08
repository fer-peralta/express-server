const express = require("express")
const app = express()

const productsRouter = require("./routes/products")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Server up
app.listen(8080, ()=>{
    console.log("Server listening in 8080")
})

app.use("/api/products", productsRouter)