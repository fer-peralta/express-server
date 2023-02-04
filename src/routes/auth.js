import express from "express"

import passport from "passport"
import bcrypt from "bcrypt"
import { Strategy as LocalStrategy } from "passport-local"
import {UserModel} from "../models/user.models.js"
import { logger } from "../loggers/loggers.js"

import { checkLogin } from "../middlewares/checkLogin.js"

import { transporterEmail, emailAdmin } from "../messages/email.js"

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

const isValidPassword = (user, password)=>{
    return bcrypt.compareSync(password, user.password);
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

passport.use('loginStrategy', new LocalStrategy(
        // {
        //     passReqToCallback:true
        // },
        (username, password, done) => {
            logger.info(username);
            UserModel.findOne({ username: username }, (error, user)=> {
                logger.info(user);
                if(error || !user) return res.json({message:`Hubo un error ${error}`})
                if (!user.password) return done(null, false,{message:`Hubo un error con la contraseña ${error}`});
                if (!isValidPassword(user,password)){
                    logger.info('existen datos')
                    return done(null,false,{message:'password invalida'})
                }
                return done(null, user, {message:`Sesión iniciada con éxito`});
            });
        }
    ))


const authRouter = express.Router()

authRouter.post("/signup",(req,res)=>{
    passport.authenticate("signUpStrategy",(error, user, info)=>{
        if(error || !user) return res.json({message:info.message})
        req.logIn(user, function(error){
            if(error) return res.json({message:`Hubo un error al autenticar el usuario: ${error}`})
            transporterEmail.sendMail({
                from:"Server node",
                to:emailAdmin,
                subject:"Nuevo registro",
                text:`El usuario ${user.username} se registró exitosamente`
                },(error, response)=>{
                    if(error) {
                        logger.error("Hubo un error al enviar el mensaje al admin")
                    }else {
                        logger.info("Se ha registrado un usuario")
                    }
                }
            )
            res.json({user, message:info.message})
        })
    })(req, res)
})

authRouter.get("/home", checkLogin,(req,res)=>{
    res.send("Home")
})

authRouter.post("/login",(req,res,next)=>{
    logger.info(req.body)
    passport.authenticate("loginStrategy",(error, user, info)=>{
        if(error || !user) return res.json({message:info.message})
        req.logIn(user, function(error){
            if(error) return res.json({message:`Hubo un error al autenticar el usuario: ${error}`})
            res.json({user, message:info.message})
        })
    })(req, res, next)
})

authRouter.get("/profile",checkLogin,(req,res)=>{
    res.status(200).json(
    {   message: "Datos del usuario",
        username: req.body.username,
        name: req.body.name,
        address: req.body.address,
        age: req.body.age,
        telephone: req.body.telephone,
        avatar: req.body.avatar
    })
})

authRouter.post("/logout",(req,res)=>{
    req.logOut((error)=>{
        if(error) return res.status(400).json({message:`Error al cerrar sesión: ${error}`})
        res.status(200).json({message: `Sesión finalizada`})
    })
})

export {authRouter}