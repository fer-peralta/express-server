import express from "express"
import { apiRouter } from "./routes/index.js"
import { options } from "./config/dbConfig.js"
import { config } from "./config/config.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import { normalize, schema } from "normalizr"
// import faker from '@faker-js/faker'
// import {commerce, datatype} from  "@faker-js/faker"
// * - Session -
import session from "express-session"
import cookieParser from 'cookie-parser'
import passport from 'passport'
import MongoStore from 'connect-mongo'

import path from "path"
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import parseArgs from "minimist"
import cluster from "cluster"
import os from "os"

import { logger } from "./logger.js"
import { logArchivoWarn } from "./logger.js"
import { logArchivoError } from "./logger.js"

// ? ---------------------------------

import { ContenedorChat } from './persistence/managers/ContenedorChat.js'
import { Containersql } from "./persistence/managers/ContainerSql.js"

const container = new Containersql(options.mariaDB, "products")
// const chatApi = new Containersql(options.sqliteDB,"chat")
const chatApi = new ContenedorChat("../files/chat.txt")

const app = express()

// * Read in JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ? ---------------------------------

// * Arguments
const argOptions = { alias: { m: "mode" }, default: { mode: "FORK" } }
const objArguments = parseArgs(process.argv.slice(2), argOptions)

const mode = objArguments.mode

// ? --------------------------------------------------------

if (mode === "CLUSTER" && cluster.isPrimary) {
    logger.info("CLUSTER mode")
    const numCPUS = os.cpus().length // * number of processors
    logger.info(`Numero de procesadores: ${numCPUS}`)

    for (let i = 0; i < numCPUS; i++) {
        cluster.fork() // * subprocess
        logger.info("cluster created")
    }

    cluster.on("exit", (worker) => {
        logArchivoError.error(`El subproceso ${worker.process.pid} falló`)
        cluster.fork()
    })
}
else {
    logger.info("FORK mode")
    // * We use the port that the enviroment provide or the 8080
    const PORT = process.env.PORT || 8080
    const server = app.listen(PORT, () => { logger.info(`Server listening in ${PORT} on process ${process.pid}`) })

    // * Connecting Web Socket with server
    const io = new Server(server)

    // * Connections Client-Server

    io.on("connection", async (socket) => {
        // * Connected
        logger.info(`El usuario con el id ${socket.id} se ha conectado`)

        // * Sending the info to the new user
        io.sockets.emit('products', await container.getAll());
        io.sockets.emit('chat', await normalizarMensajes());

        // * Message to the users
        socket.broadcast.emit("Ha ingresado un nuevo usuario")

        //* Receiving the new product and saving it in the file, then updating the list
        socket.on('newProduct', async (newProduct) => {
            await container.save(newProduct);
            io.sockets.emit("products", await container.getAll())
        })

        // * Receiving the message and saving it in the file, then update the chats
        socket.on('newMessage', async (newMessage) => {
            await chatApi.save(newMessage);
            io.sockets.emit("chat", await normalizarMensajes())
        })
    })

    const authorSchema = new schema.Entity("authors", {}, { idAttribute: "email" })

    // * message schema
    const messageSchema = new schema.Entity("messages", { author: authorSchema })

    // * chat schema, global schema

    const chatSchema = new schema.Entity("chat", {
        messages: [messageSchema]
    },
        { idAttribute: "id" }
    )

    // * Normalize data
    const normalizarData = (data) => {
        const normalizeData = normalize({ id: "chatHistory", messages: data }, chatSchema);
        return normalizeData;
    };

    const normalizarMensajes = async () => {
        const results = await chatApi.getAll();
        // logger.info(results)
        let sinNormalizarTamaño = JSON.stringify(results).length
        const messagesNormalized = normalizarData(results);
        let normalizadoTamaño = JSON.stringify(messagesNormalized).length
        let porcentajeCompresion = (1 - (normalizadoTamaño / sinNormalizarTamaño)) * 100
        // porcentajeCompresion = (1 -(normalizadoTamaño / sinNormalizarTamaño))*100
        logger.info(`El porcentaje de compresión de los mensajes es: ${porcentajeCompresion}`)
        io.sockets.emit("compressPercent", porcentajeCompresion)
        return messagesNormalized;
    }
}

// * HandleBars & views
app.engine("handlebars", handlebars.engine())
app.set("views", "./src/public/views")
app.set("view engine", "handlebars")

// ? ---------------------------------------------------------

// * Cookies, session

app.use(cookieParser())

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.MONGO_SESSION
    }),
    secret: "claveSecreta",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000
    }
}))

app.use(passport.initialize())
app.use(passport.session())

// ? --------------------------------------------------------

// * Main route
app.use("/api", apiRouter)

app.get('/', async (req, res) => {
    res.render("home", { products: await container.getAll() })
})

// * Public route
app.use(express.static(__dirname + "/public"))

// app.get("/products-test", (req,res)=>{
//     let test = []
//     for(let i= 0; i<5; i++){
//         test.push(
//             {
//                 id : datatype.uuid(),
//                 name : commerce.product(),
//                 price : commerce.price(),
//                 url : `${datatype.uuid()}.jpg`
//             }
//         )
//     }
//     res.render("products-test",{products: test})
// })