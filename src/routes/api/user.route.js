import express from 'express'
import passport from 'passport'
import * as UserController from '../../controllers/user.controller.js'
import { signUpStrategy, logInStrategy } from '../middlewares/auth.middleware.js'
import { checkLogin } from '../middlewares/checkLogin.js'

const router = express.Router()

passport.use('signupStrategy', signUpStrategy)
passport.use('loginStrategy', logInStrategy)

router.get('/', checkLogin, UserController.getUsersController)

router.post("/signup", UserController.SignUpUserController)

router.post("/login", UserController.logInUserController)

router.get("/logout", checkLogin, UserController.logOutUserController)

router.get("/profile", checkLogin, UserController.profileUserController)

router.get('/:id', checkLogin, UserController.findUserController)

export { router as userRouter }