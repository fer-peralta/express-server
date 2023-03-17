import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import { UserModel } from '../../database/models/user.model.js'
import { logger } from '../../config/logger.js'

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
    logger.info(password);
    UserModel.findOne({ username: username }, (error, userFound) => {
        if (error) return done(error, null, { message: 'hubo un error' })
        if (userFound) return done(null, null, { message: 'el usuario existe' })
        const newUser = {
            name: req.body.name,
            username: username,
            password: createHash(password)
        }
        logger.info(newUser);
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
    logger.info(username);
    UserModel.findOne({ username: username }, (err, user) => {
        logger.info(user);
        if (err) return done(err);
        if (!user) return done(null, false);
        if (!user.password) return done(null, false);
        if (!isValidPassword(user, password)) {
            logger.info('existen datos')
            return done(null, false, { message: 'password invalida' })
        }
        return done(null, user);
    });
}
)

export { logInStrategy, signUpStrategy }