import express from "express"
import router from "./routes/routes.js"
import routerInfo from "./routes/routerInfo.js"
import {options} from "./config/dbConfig.js"
import {config} from "./config/config.js"
import handlebars from "express-handlebars"
import {Server} from "socket.io"
import {normalize, schema} from "normalizr"
// import faker from '@faker-js/faker'
// import {commerce, datatype} from  "@faker-js/faker"
// * - Session -
import session from "express-session"
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
// * - Authentication -
import bcrypt from "bcrypt"
import passport from "passport"
import { Strategy as LocalStrategy } from 'passport-local'
import {UserModel} from './model/users.js'

import path from "path"
import {fileURLToPath} from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import parseArgs from "minimist"
import cluster from "cluster"
import os from "os"

import { logger } from "./logger.js"
import { logArchivoWarn } from "./logger.js"
import { logArchivoError } from "./logger.js"


// ? ---------------------------------

import {ContenedorChat} from './managers/ContenedorChat.js'
import {Containersql} from "./managers/ContainerSql.js"

const container = new Containersql(options.mariaDB, "products")
// const chatApi = new Containersql(options.sqliteDB,"chat")
const chatApi = new ContenedorChat("chat.txt")

const app = express()

// ? ---------------------------------

// * Arguments
const argOptions = {alias:{m:"mode"}, default:{mode: "FORK"}}
const objArguments = parseArgs(process.argv.slice(2), argOptions)

// logger.info("objArguments", objArguments)

const mode = objArguments.mode

// ? --------------------------------------------------------

if(mode === "CLUSTER" && cluster.isPrimary){
    logger.info("CLUSTER mode")
    const numCPUS = os.cpus().length // * number of processors
    logger.info(`Numero de procesadores: ${numCPUS}`)
    logger.info(`PID MASTER ${process.pid}`)

    for(let i=0;i<numCPUS;i++){
        cluster.fork() // * subprocess
        logger.info("cluster created")
    }

    cluster.on("exit", (worker)=>{
        logArchivoError.error(`El subproceso ${worker.process.pid} falló ${new Date().toLocaleString()}`)
        cluster.fork()
    })
}
else {
    logger.info("FORK mode")
    // * We use the port that the enviroment provide or the 8080
    // const PORT = process.argv[2] || 8080
    const PORT = process.env.PORT || 8080
    const server = app.listen(PORT, ()=>{logger.info(`Server listening in ${PORT} on process ${process.pid}`)})

    // * Connecting Web Socket with server
    const io = new Server(server)

    // * Connections Client-Server

    io.on("connection",async(socket)=>{
        // * Connected
        logger.info(`El usuario con el id ${socket.id} se ha conectado`)

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

    const authorSchema = new schema.Entity("authors", {}, {idAttribute: "email"})

    // * message schema
    const messageSchema = new schema.Entity("messages", {author:authorSchema})

    // * chat schema, global schema

    const chatSchema = new schema.Entity("chat", {
        messages:[messageSchema]
        }, 
        {idAttribute:"id"}
    )

    // * Normalize data
    const normalizarData = (data)=>{
        const normalizeData = normalize({id:"chatHistory", messages:data}, chatSchema);
        return normalizeData;
    };

    const normalizarMensajes = async()=>{
        const results = await chatApi.getAll();
        let sinNormalizarTamaño = JSON.stringify(results).length
        const messagesNormalized = normalizarData(results);
        let normalizadoTamaño = JSON.stringify(messagesNormalized).length
        let porcentajeCompresion = (1 -(normalizadoTamaño / sinNormalizarTamaño))*100
        // porcentajeCompresion = (1 -(normalizadoTamaño / sinNormalizarTamaño))*100
        logger.info(porcentajeCompresion)
        io.sockets.emit("compressPercent", porcentajeCompresion)
        return messagesNormalized;
    }
}


// * Read in JSON
app.use(express.json())
app.use(express.urlencoded({extended: true}))



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
    secret:"claveSecreta",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:600000
    }
}))

// ? --------------------------------------------------------

// * Authentication DB
const mongoUrl = config.MONGO_AUTENTICATION

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology:true
}, (err)=>{
    if(err) return logArchivoError.error(`hubo un error: ${err}`);
    logger.info('conexion a base de datos exitosa');
})

// * Passport

app.use(passport.initialize())
app.use(passport.session())

// * Serializing
passport.serializeUser((user,done)=>{
    done(null, user.id)
})

passport.deserializeUser((id, done)=>{
    UserModel.findById(id,(error, userFound)=>{
        if(error) return done(error)
        logArchivoError.error(error)
        return done(null,userFound)
    })
})

// * Encrypt password
const createHash = (password)=>{
    const hash = bcrypt.hashSync(password,bcrypt.genSaltSync(10))
    return hash
}
// * Validate the password
const isValidPassword = (user, password)=>{
    return bcrypt.compareSync(password, user.password);
}

// * Passport Strategy create User
passport.use('signupStrategy', new LocalStrategy({
    passReqToCallback:true,
    usernameField: "email",
},
    (req,username,password,done)=>{
        logger.info(username);
        UserModel.findOne({username:username}, (error,userFound)=>{
            if (error) return done(error,null,{message:'hubo un error'})
            logArchivoError.error(error)
            if(userFound) return done(null,null,{message:'el usuario existe'}) 
            const newUser = {
                name: req.body.name,
                username:username,
                password:createHash(password)
            }
            logger.info(newUser);
            UserModel.create(newUser, (error,userCreated)=>{
                if(error) return done(error,null, {message:'error al registrar'})
                logArchivoError.error(error)
                return done(null, userCreated,{message:'usuario creado'})
            })
        })
    }
))

// * Passport Strategy Login
passport.use('loginStrategy', new LocalStrategy(
    (username, password, done) => {
        logger.info(username);
        UserModel.findOne({ username: username }, (err, user)=> {
            logger.info(user);
            if (err) return done(err);
            if (!user) return done(null, false);
            if (!user.password) return done(null, false);
            if (!isValidPassword(user,password)){
                logger.info('existen datos')
                return done(null,false,{message:'Contraseña inválida'})
            }
            return done(null, user);
        });
    }
))

// ? ------------------------------------------------------



// * Main route
app.use("/api/products", router)
app.use("/api/info", routerInfo)

app.get('/*', async(req,res)=>{
    logArchivoWarn.warn('No se encontró la ruta')
    res.status(404).send('<h1>404! Page not found</h1>');
})

app.get('/', async(req,res)=>{
    res.render("home",{products: await container.getAll()})
})

app.get("/chat", async(req,res)=>{
    res.render("partials/chat",{messages: await chatApi.getAll()})
})

app.get("/products", async(req,res)=>{
    res.render("partials/products",{products: await container.getAll()})
})

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

app.get('/registro', async(req,res)=>{
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    logger.info(req.session);
    res.render('signup',{error:errorMessage})
    req.session.messages = []
})

app.get('/inicio-sesion', (req,res)=>{
    res.render('login')
})

app.post('/signup',passport.authenticate('signupStrategy',{
    failureRedirect:'/registro',
    failureMessage:true
}),(req,res)=>{
    res.redirect('/perfil')
})

app.post('/login',passport.authenticate('loginStrategy',{
    failureRedirect: '/inicio-sesion',
    failureMessage:true
}),
(req,res)=>{
    res.redirect('/perfil')
})

app.get('/perfil',async(req,res)=>{
    if(req.isAuthenticated()){
        let {name} = req.user
        res.render('home',{user:name})
    }else{
        res.send("<div>Debes <a href='/inicio-sesion'>iniciar sesion</a> o <a href='/registro'>registrarte</a></div>")
    }
})

app.get('/logout',(req,res)=>{
    req.session.destroy()
    setTimeout(()=>{
            res.redirect('./inicio-sesion')
    },3000)
})

// * Public route
app.use(express.static(__dirname+"/public"))

// * Schemas normalizr
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

// * Normalize data
const normalizarData = (data)=>{
    const normalizeData = normalize({id:"chatHistory", messages:data}, chatSchema);
    return normalizeData;
};

const normalizarMensajes = async()=>{
    const results = await chatApi.getAll();
    let sinNormalizarTamaño = JSON.stringify(results).length
    const messagesNormalized = normalizarData(results);
    let normalizadoTamaño = JSON.stringify(messagesNormalized).length
    let porcentajeCompresion = (1 -(normalizadoTamaño / sinNormalizarTamaño))*100
    // porcentajeCompresion = (1 -(normalizadoTamaño / sinNormalizarTamaño))*100
    logger.info(porcentajeCompresion)
    io.sockets.emit("compressPercent", porcentajeCompresion)
    return messagesNormalized;
}

// ? ---------------------------------------------------------------
// ? ---------------------------------------------------------------







