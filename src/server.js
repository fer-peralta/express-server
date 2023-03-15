import express from "express";
import { loggerInfo, loggerError, loggerWarn } from "./database/logs/loggers.js"
import session from "express-session";
import MongoStore from "connect-mongo";
import {options} from "./config/dbConfig.js"
import passport from "passport";

import cluster from "cluster";
import os from "os"
import parseArgs from "minimist"
import { apiRouter } from "./routes/index.js";

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

// * Arguments && mode CLUSTER or FORK
const argOptions = {alias:{m:"mode"}, default:{mode: "FORK"}}
const objArguments = parseArgs(process.argv.slice(2), argOptions)
const mode = objArguments.mode

if(mode === "CLUSTER" && cluster.isPrimary){
    loggerInfo.info(`${argOptions.default.mode} mode`)
    const numCPUS = os.cpus().length // * number of processors
    loggerInfo.info(`Numero de procesadores: ${numCPUS}`)
    loggerInfo.info(`PID MASTER ${process.pid}`)

    for(let i=0;i<numCPUS;i++){
        cluster.fork() // * subprocess
        loggerInfo.info("cluster created")
    }

    cluster.on("exit", (worker, error)=>{
        loggerError.error(`El subproceso ${worker.process.pid} falló, ${new Date().toLocaleString()} ${error}`)
        cluster.fork()
    })
} else {
    loggerInfo.info(`${argOptions.default.mode} mode`)
    loggerInfo.info(`PID MASTER ${process.pid}`)
}

// * Passport settings
app.use(passport.initialize())
app.use(passport.session())

// * Routes
// app.use('/api/auth', authRouter);
// app.use('/api/products', productsRouter);
// app.use('/api/carts', cartsRouter);
app.use("/api", apiRouter)

// * PORT and listen server
const PORT = process.pid.PORT || 8080 || 8081;
const server = app.listen(PORT, () => {
    loggerInfo.info(`Server listening on port ${PORT}`);
})
server.on('error', error => logger.fatal(`Error in server ${error}`))