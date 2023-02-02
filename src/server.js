import express from "express";
import { cartsRouter } from "./routes/carts.js";
import { productsRouter } from "./routes/products.js";
import { authRouter } from "./routes/auth.js";


import {logger} from "./loggers/loggers.js"
import session from "express-session";
import MongoStore from "connect-mongo";
import {options} from "./config/dbConfig.js"
import passport from "passport";

// * Importing express and the routes of the app
const app = express()

// * Read JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// * Session settings
app.use(session({
    store:MongoStore.create({
        mongoUrl:options.MongoDB.url
    }),
    secret:"claveSecreta",
    resave:false,
    saveUninitialized:false
}))

// * Passport settings
app.use(passport.initialize())
app.use(passport.session())

// * Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// app.get('/', async(req,res)=>{
//     res.render("home",{products: await productosApi.getAll()})
// })

// app.get("/chat", async(req,res)=>{
//     res.render("chat",{messages: await chatApi.getAll()})
// })

// app.get("/products", async(req,res)=>{
//     res.render("chat",{products: await productosApi.getAll()})
// })

// * PORT and listen server
const PORT = 8080;
const server = app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
})
server.on('error', error => logger.fatal(`Error in server ${error}`))