const express = require("express")
const {Server} = require("socket.io")
const fs = require("fs")
const Containersql = require("./managers/ContainerSql")
const options = require("./config/dbConfig")

const container = new Containersql(options.mariaDB, "products")
const chatApi = new Containersql(options.sqliteDB,"chat")

// * imports
const router = require("./routes/routes")

// * We use the port that the enviroment provide or the 8080
const PORT = process.env.PORT || 8080

// * Importing express and the routes of the app
const app = express()

// * Read in JSON
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// * HandleBars
const handlebars = require("express-handlebars")
app.engine("handlebars", handlebars.engine())
app.set("views", "./src/public/views")
app.set("view engine", "handlebars")

// * Main route
app.use("/api/products", router)

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
app.use(express.static(__dirname+"/public"))

// * Creating server in PORT
const server = app.listen(PORT, ()=>{console.log(`Server listening in ${PORT}`)})

// * Connecting Web Socket with server
const io = new Server(server)

// * Connections Client-Server

io.on("connection",async(socket)=>{
    // * Connected
    console.log(`El usuario con el id ${socket.id} se ha conectado`)

    // * Sending the info to the new user
    io.sockets.emit('products', await container.getAll());
	io.sockets.emit('chat', await chatApi.getAll());

    // * Message to the users
    socket.broadcast.emit("Ha ingresado un nuevo usuario")

    //* Receiving the new product and saving it in the file, then updating the list
    socket.on('newProduct', async(newProduct) =>{
        await container.save(newProduct);
        io.sockets.emit("products", await container.getAll())
    })

    // * Receiving the message and saving it in the file, then update the chats
    socket.on('newMessage', async(newMessage) =>{
        console.log(newMessage);
        await chatApi.save(newMessage);
        io.sockets.emit("chat", await chatApi.getAll())
    })
})


