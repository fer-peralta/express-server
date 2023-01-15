import express, { application } from 'express'
import {fork} from 'child_process'
import os from "os"

import compression from 'compression'

const routerInfo = express.Router()

routerInfo.get('/',(req,res)=>{
    
    res.json({Version_de_Node_JS : process.version,
    Nombre_de_la_plataforma: process.platform,
    Path_de_ejecución : process.execPath,
    Proceso_ID : process.pid,
    Memoria_en_uso: process.memoryUsage().rss,
    Directorio :process.cwd(),
    Número_de_procesadores: os.cpus().length
})
})

routerInfo.get('/randoms',(req,res)=>{

    const child = fork("src/child/child.js");
    const {cantidad} = req.query
    
    let obj = {};
    cantidad
            ? child.send({ cantidad, obj })
            // : child.send({ cantidad: 500000000, obj });
            : child.send({ cantidad: 50000, obj });
            child.on('message', msg => res.json(msg))
    
})

routerInfo.get('/randomsZip', compression(), (req,res)=>{

    const child = fork("src/child/child.js");
    const {cantidad} = req.query
    
    let obj = {};
    cantidad
            ? child.send({ cantidad, obj })
            : child.send({ cantidad: 50000, obj });
            child.on('message', msg => res.json(msg))
    
})

export default routerInfo