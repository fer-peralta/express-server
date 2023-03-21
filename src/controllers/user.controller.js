import { getUsers, saveUser, findUser, updateUser } from "../services/user.service.js";
import passport from 'passport'
import { signUpStrategy, logInStrategy } from '../routes/middlewares/auth.middleware.js'
import { loggerError, loggerInfo } from "../database/logs/loggers.js";
import { signUpMail } from "../messages/emails/userSignup.email.js";

passport.use('signUpStrategy', signUpStrategy)
passport.use('logInStrategy', logInStrategy)

export const getUsersController = async (req, res) => {
    try {
        const response = await getUsers();
        res.status(200).json({ data: response });
    } catch (error) {
        loggerError.error({ message: `There was an error: ${error}` })
        res.status(400).json(errorMessage)
    }
}

export const SignUpUserController = async (req, res, next) => {
    try {
        passport.authenticate("signUpStrategy", (error, user, info) => {
            loggerError.error({ message: `There was an error: ${error}` })
            if (error || !user) return res.json({ message: info.message })
            req.logIn(user, function (error) {
                loggerError.error({ message: `There was an error: ${error}` })
                if (error) return res.json({ message: `There was an error signing up: ${error}` })
                signUpMail(user)
                res.json({ user, message: info.message })
            })
        })(req, res, next)
    } catch (error) {
        const errorMessage = loggerError.error({ message: `There was an error: ${error}` })
        res.status(400).json(errorMessage)
    }
}

export const logInUserController = async (req, res, next) => {
    try {
        passport.authenticate("logInStrategy", (error, user, info) => {
        if (error || !user) return res.json({ message: info.message })
            req.logIn(user, (error) => {
                if (error) return res.json({ message: info.message, error: error })
                res.json({ user, message: info.message })
            })

    })(req, res, next)
    } catch (error) {
        loggerError.error({ message: `There was an error: ${error}` })
        res.status(400).json(errorMessage)
    }
}

export const logOutUserController = async (req, res) => {
    req.logOut((error) => {
        if (error) return res.status(400).json({ message: `There was an error logging out: ${error}` })
        res.status(200).json({ message: `User log out with success` })

    })
}
export const profileUserController = async (req, res) => {
    try {
        res.status(200).json({ message: "User profile", User: req.user })
    } catch {
        const errorMessage = loggerError.error({ message: `There was an error: ${error}` })
        res.status(400).json(errorMessage)
    }
}

export const findUserController = async (req, res) => {
    try {
        const response = await findUser(req.params.id);
        res.status(200).json(response)
    } catch (error) {
        const errorMessage = loggerError.error({ message: `There was an error: ${error}` })
        res.status(400).json(errorMessage)
    }
}