import express from "express"

import passport from "passport"
import bcrypt from "bcrypt"
import { Strategy as LocalStrategy } from "passport-local"
import {UserModel} from "../models/user.models.js"
import { logger } from "../loggers/loggers.js"

import { checkLogin } from "../middlewares/checkLogin.js"

passport.serializeUser((user,done)=>{
    return done(null, user.id)
})

passport.deserializeUser((id, done)=>{
    UserModel.findById(id,(error,userFound)=>{
        return(done(error, userFound))
    })
})

const createHash = (password)=>{
    const hash = bcrypt.hashSync(password,bcrypt.genSaltSync(10))
    return hash
}

passport.use("signUpStrategy", new LocalStrategy(
    {
        passReqToCallback:true
    },
    (req,username,password,done)=>{
        // logger.info(req.body)
        UserModel.findOne({username:username},(error,userFound)=>{
            // if(userFound) return logger.info(`Usuario encontrado ${userFound}`), done(null, null)
            if(error) return done(null,null,{message:`Hubo un error ${error}`})
            // if(userFound) return done(null,null),logger.info({message:"El usuario ya existe"})
            if(userFound) return done(null,null,{message:"El usuario ya existe"})
            const newUser={
                name:req.body.name,
                username:req.body.username,
                password:createHash(password),
                telephone:req.body.telephone,
                address:req.body.adress,
                age:req.body.age,
                avatar:req.body.avatar,
            }
            UserModel.create(newUser,(error,userCreated)=>{
                if(error) return done(null,null,{message:`Hubo un error al registrar al usuario: ${error}`})
                return done(null, userCreated, {message: "Usuario creado con éxito"})
            })
        })
    }
))

const authRouter = express.Router()

authRouter.post("/signup",(req,res)=>{
    passport.authenticate("signUpStrategy",(error, user, info)=>{
        if(error || !user) return res.json({message:info.message})
        req.logIn(user, function(error){
            if(error) return res.json({message:`Hubo un error al autenticar el usuario: ${error}`})
            res.json({user, message:info.message})
        })
    })(req, res)
})

authRouter.get("/home", checkLogin,(req,res)=>{
    res.send("Home")
})

authRouter.post("/logout",(req,res)=>{
    req.logOut((error)=>{
        if(error) return res.status(400).json({message:`Error al cerrar sesión: ${error}`})
        res.status(200).json({message: `Sesión finalizada`})
    })
})

export {authRouter}