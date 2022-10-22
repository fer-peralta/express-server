const express = require("express")
const {Server} = require("socket.io")
const fs = require("fs")

// * imports
const {router, products, messages} = require("./routes/routes")

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
app.use("/", router)

// * Public route
app.use(express.static(__dirname+"/public"))

// * Creating server in PORT
const server = app.listen(PORT, ()=>{console.log(`Server listening in ${PORT}`)})

// * Connecting Web Socket with server
const io = new Server(server)

// * Connections Client-Server

io.on("connection",(socket)=>{
    // * Connected
    console.log(`El usuario con el id ${socket.id} se ha conectado`)

    // * Sending the info to the new user
    io.sockets.emit('products', products);
	io.sockets.emit('chat', messages);

    // * Message to the users
    socket.broadcast.emit("Ha ingresado un nuevo usuario")

    //* Receiving the new product and saving it in the file, then updating the list
    socket.on('newProduct', newProduct =>{
        products.push(newProduct)
        fs.writeFileSync('./src/public/products.txt', JSON.stringify(products))
        io.sockets.emit('sendProductList', products)
    })

    // * Receiving the message and saving it in the file, then update the chats
    socket.on('newMessage', newMessage =>{
        console.log(newMessage);
        messages.push(newMessage)
        fs.writeFileSync('./src/public/messages.txt', JSON.stringify(messages))
        io.sockets.emit('chat', messages)
    })
})


