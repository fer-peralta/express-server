const express = require("express")
const app = express()

const productsRouter = require("./routes/products_routes")
const cartsRouter = require("./routes/carts_routes")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const PORT = process.env.PORT || 8080

//Server up
const server = app.listen(PORT, ()=>{console.log(`Server listening in ${PORT}`)})

app.use("/api/products", productsRouter)
app.use("/api/cart", cartsRouter)

app.use((req, res, next) => {
    res.status(404).send("Lo siento, no pudimos encontrar esa página")
})
