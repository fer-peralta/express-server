import express from 'express'
import {fork} from 'child_process'
import os from "os"

import compression from 'compression'

const router = express.Router()
const childUrl = "src/services/info.child.service.js"

router.get('/',(req,res)=>{
    res.json({Version_de_Node_JS : process.version,
    Nombre_de_la_plataforma: process.platform,
    Path_de_ejecución : process.execPath,
    Proceso_ID : process.pid,
    Memoria_en_uso: process.memoryUsage().rss,
    Directorio :process.cwd(),
    Número_de_procesadores: os.cpus().length
})
})

router.get('/randoms',(req,res)=>{

    const childRandom = fork(childUrl);
    const {cantidad} = req.query
    
    let obj = {};
    cantidad
            ? childRandom.send({ cantidad, obj })
            // : child.send({ cantidad: 500000000, obj });
            : childRandom.send({ cantidad: 50000, obj });
            childRandom.on('message', msg => res.json(msg))
    
})

router.get('/randomsZip', compression(), (req,res)=>{

    const childRandomZip = fork(childUrl);
    const {cantidad} = req.query
    
    let obj = {};
    cantidad
            ? childRandomZip.send({ cantidad, obj })
            : childRandomZip.send({ cantidad: 50000, obj });
            childRandomZip.on('message', msg => res.json(msg))
    
})

export {router as InfoRouter}