const express = require("express")
const options = require("./config/dbConfig")
const router = require("./routes/routes")
const handlebars = require("express-handlebars")
const {Server} = require("socket.io")
const {normalize, schema} = require("normalizr")
const { faker } = require('@faker-js/faker')
const {commerce, datatype} = faker
// * - session -
const session = require("express-session")
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')

const ContenedorChat = require('./managers/ContenedorChat')

const Containersql = require("./managers/ContainerSql")
const container = new Containersql(options.mariaDB, "products")
// const chatApi = new Containersql(options.sqliteDB,"chat")
const chatApi = new ContenedorChat("chat.txt")

// * We use the port that the enviroment provide or the 8080
const PORT = process.env.PORT || 8080

// * Importing express and the routes of the app
const app = express()

// * Read in JSON
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// * HandleBars
app.engine("handlebars", handlebars.engine())
app.set("views", "./src/public/views")
app.set("view engine", "handlebars")

// * Main route
app.use("/api/products", router)

app.get('/', async(req,res)=>{
    res.render("home",{products: await container.getAll()})
})

app.get("/chat", async(req,res)=>{
    res.render("partials/chat",{messages: await chatApi.getAll()})
})

app.get("/products", async(req,res)=>{
    res.render("partials/products",{products: await container.getAll()})
})

app.get("/products-test", (req,res)=>{
    let test = []
    for(let i= 0; i<5; i++){
        test.push(
            {
                id : datatype.uuid(),
                name : commerce.product(),
                price : commerce.price(),
                url : `${datatype.uuid()}.jpg`           
            }
        )
    }
    res.render("products-test",{products: test})
})

// * Public route
app.use(express.static(__dirname+"/public"))

// * schemas normalizr
// * author schema
const authorSchema = new schema.Entity("authors", {}, {idAttribute: "email"})

// * message schema
const messageSchema = new schema.Entity("messages", {author:authorSchema})

// * chat schema, global schema

const chatSchema = new schema.Entity("chat", {
    messages:[messageSchema]
    }, 
    {idAttribute:"id"}
)

const normalizarData = (data)=>{
    const normalizeData = normalize({id:"chatHistory", messages:data}, chatSchema);
    return normalizeData;
};

const normalizarMensajes = async()=>{
    const results = await chatApi.getAll();
    let sinNormalizarTamaño = JSON.stringify(results).length
    const messagesNormalized = normalizarData(results);
    let normalizadoTamaño = JSON.stringify(messagesNormalized).length
    // let porcentajeCompresion = (1 -(normalizadoTamaño / sinNormalizarTamaño))*100
    porcentajeCompresion = (1 -(normalizadoTamaño / sinNormalizarTamaño))*100
    console.log(porcentajeCompresion)
    io.sockets.emit("compressPercent", porcentajeCompresion)
    return messagesNormalized;
}

// * Creating server in PORT
const server = app.listen(PORT, ()=>{console.log(`Server listening in ${PORT}`)})

// ? ---------------------------------------------------------------
// ? ---------------------------------------------------------------

// * Connecting Web Socket with server
const io = new Server(server)

// * Connections Client-Server

io.on("connection",async(socket)=>{
    // * Connected
    console.log(`El usuario con el id ${socket.id} se ha conectado`)

    // * Sending the info to the new user
    io.sockets.emit('products', await container.getAll());
	io.sockets.emit('chat', await normalizarMensajes());

    // * Message to the users
    socket.broadcast.emit("Ha ingresado un nuevo usuario")

    //* Receiving the new product and saving it in the file, then updating the list
    socket.on('newProduct', async(newProduct) =>{
        await container.save(newProduct);
        io.sockets.emit("products", await container.getAll())
    })

    // * Receiving the message and saving it in the file, then update the chats
    socket.on('newMessage', async(newMessage) =>{
        await chatApi.save(newMessage);
        io.sockets.emit("chat", await normalizarMensajes())
    })
})

// ? ---------------------------------------------------------

// * Cookies y session

app.use(cookieParser())

app.use(session({
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://ferguitarra1490:Guitarra,1490@ecommerce.vi3tez0.mongodb.net/sessionsDB?retryWrites=true&w=majority'
    }),
    secret:"claveSecreta",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:600000
    }
}))

