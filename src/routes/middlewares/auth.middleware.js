import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import { UserModel } from '../../database/models/user.model.js'
import { loggerInfo, loggerError, loggerWarn } from "../../database/logs/loggers.js"

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (error, userFound) => {
        if (error) return done(error)
        return done(null, userFound)
    })
})

const createHash = (password) => {
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    return hash;
}
const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

const signUpStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, username, password, done) => {
    loggerInfo.info(password);
    UserModel.findOne({ username: username }, (error, userFound) => {
        console.log("hola")
        if (error) return done(error, null, { message: 'hubo un error' })
        if (userFound) return done(null, null, { message: 'el usuario existe' })
        const newUser = {
            name: req.body.name,
            username: username,
            password: createHash(password)
        }
        loggerInfo.info(newUser);
        UserModel.create(newUser, (error, userCreated) => {
            if (error) return done(error, null, { message: 'error al registrar' })
            return done(null, userCreated, { message: 'usuario creado' })
        })
    })
})

const logInStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, username, password, done) => {
    loggerInfo.info(username);
    UserModel.findOne({ username: username }, (err, user) => {
        loggerInfo.info(user);
        if (err) return done(err);
        if (!user) return done(null, false);
        if (!user.password) return done(null, false);
        if (!isValidPassword(user, password)) {
            loggerInfo.info('existen datos')
            return done(null, false, { message: 'password invalida' })
        }
        return done(null, user);
    });
}
)

export { logInStrategy, signUpStrategy }