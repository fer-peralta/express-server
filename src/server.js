import express from "express";
import { cartsRouter } from "./routes/carritos.js";
import { productsRouter } from "./routes/products.js";

// * Importing express and the routes of the app
const app = express()

// * Read JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// * Routes
app.use('/api/productos', productsRouter);
app.use('/api/carritos', cartsRouter);

app.get('/', async(req,res)=>{
    res.render("home",{products: await container.getAll()})
})

app.get("/chat", async(req,res)=>{
    res.render("chat",{messages: await chatApi.getAll()})
})

app.get("/products", async(req,res)=>{
    res.render("chat",{products: await container.getAll()})
})

// * Public route
app.use('/static', express.static('public'))

// * PORT and listen server
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})
server.on('error', error => console.log(`Error in server ${error}`))