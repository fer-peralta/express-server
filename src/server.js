const express = require("express")
const {Server} = require("socket.io")
const Container = require("./Container")
const Product = require("./Product")


// * Creating the container
const container1 = new Container("./src/file.txt") 

// * We use the port that the enviroment provide or the 8080
const PORT = process.env.PORT || 8080

// * Importing express and the routes of the app
const app = express()
const router = require("./routes/routes.js")

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
io.on("connection", (socket)=>{
    console.log(`El usuario con el id ${socket.id} se ha conectado`)

    socket.emit("messageFromServer","Se ha conectado exitosamente al servidor")
    
    io.sockets.emit("sendHistorical", "Mensaje para todos",
        
    )

    // socket.on("addProduct" 
    //     console.log("Se agregó un producto")
    //     console.log(data)
    //     // const productAdded = new Product(data.title, data.price, data.thumbnail)
    //     // container1.save(Product)
    // )  

})


