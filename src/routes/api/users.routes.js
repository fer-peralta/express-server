import express from 'express'

import bcrypt from "bcrypt"
import passport from "passport"
import { Strategy as LocalStrategy } from 'passport-local'
import {UserModel} from '../../persistence/models/users.js'
import { logArchivoError } from '../../logger.js'

const router = express.Router()

const app = express()


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
            if(userFound) return done(null,null,{message:'el usuario existe'}) 
            const newUser = {
                name: req.body.name,
                username:username,
                password:createHash(password)
            }
            logger.info(newUser);
            UserModel.create(newUser, (error,userCreated)=>{
                if(error) return done(error,null, {message:'error al registrar'})
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




router.get('/registro', async(req,res)=>{
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    logArchivoError.error(req.session);
    res.render('signup',{error:errorMessage})
    req.session.messages = []
})

router.get('/inicio-sesion', (req,res)=>{
    res.render('login')
})

router.post('/signup',passport.authenticate('signupStrategy',{
    failureRedirect:'./registro',
    failureMessage:true
}),(req,res)=>{
    res.redirect('./perfil')
})

router.post('/login',passport.authenticate('loginStrategy',{
    failureRedirect: './inicio-sesion',
    failureMessage:true
}),
(req,res)=>{
    res.redirect('./perfil')
})

router.get('/perfil',async(req,res)=>{
    if(req.isAuthenticated()){
        let {name} = req.user
        res.render('home',{user:name})
    }else{
        res.send("<div>Debes <a href='./inicio-sesion'>iniciar sesion</a> o <a href='./registro'>registrarte</a></div>")
    }
})

router.get('/logout',(req,res)=>{
    req.session.destroy()
    setTimeout(()=>{
            res.redirect('./inicio-sesion')
    },3000)
})

export {router as UserRouter}