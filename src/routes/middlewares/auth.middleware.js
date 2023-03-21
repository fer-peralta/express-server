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
    UserModel.findOne({ username: username }, (error, userFound) => {
        if (error) {
            loggerError.error({ message: `There was an error: ${error}` })
            return done(error, null, { message: `There was an error: ${error}` })
        }
        if (userFound) return done(null, null, { message: 'The user is already in the database, try to login' })
        const newUser = {
            username: username,
            password: createHash(password),
            name: req.body.name,
            address: req.body.address,
            age: req.body.age,
            telephone: req.body.telephone,
            avatar: req.body.avatar
        }
        UserModel.create(newUser, (error, userCreated) => {
            if (error) return done(error, null, { message: `There was an error creating the user: ${error}` })
            return done(null, userCreated, { message: 'User sign up with success' })
        })
    })
})

const logInStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, username, password, done) => {
    UserModel.findOne({ username: username }, (error, user) => {
        if (error) {
            loggerError.error({ message: `There was an error: ${error}` })
            return done(error, { message: `There was an error: ${error}` })
        }
        if (!user) return done(null, false, { message: `The username is incorrect` });
        if (!username) return done(null, false, { message: `There's missing credentials` });
        if (!user.password) return done(null, false, { message: `The password is incorrect` });
        if (!isValidPassword(user, password)) return done(null, false, { message: 'The password is incorrect' })
        if (req.user) if (username === req.user.username) return done(null, false, { message: `The user is already logged in` })
        return done(null, user, { message: "User log in with success" });
    });
}
)

export { logInStrategy, signUpStrategy }