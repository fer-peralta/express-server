import express from 'express'
import passport from 'passport'
import { getUsersController, findUserController, logInUserController, logOutUserController, profileUserController, SignUpUserController } from '../../controllers/user.controller.js'
import { loggerInfo } from '../../database/logs/loggers.js'
import { signUpStrategy, logInStrategy } from '../middlewares/auth.middleware.js'
import { checkLogin } from '../middlewares/checkLogin.js'

const router = express.Router()

passport.use('signupStrategy', signUpStrategy)
passport.use('loginStrategy', logInStrategy)

router.get('/', getUsersController)

router.get('/:id', findUserController)

router.post("/session/signup", SignUpUserController)

router.post("/session/login", logInUserController)

router.get("/session/logout", logOutUserController)

router.get("/session/profile", checkLogin, profileUserController)










router.post('/signup', passport.authenticate('signupStrategy', {
    failureRedirect: '/api/user/registro',
    passReqToCallback: true,
    failureMessage: true
}), (req, res) => {
    res.send('ok')
})

// router.post('/login', passport.authenticate('loginStrategy', {
//     failureRedirect: '/api/user/inicio-sesion',
//     passReqToCallback: true,
//     failureMessage: true
// }),
//     (req, res) => {
//         res.send('ingreso')
//     })





// router.get('/perfil', async (req, res) => {
//     if (req.isAuthenticated()) {
//         let { name } = req.user
//         res.render('form', { user: name })
//     } else {
//         res.send("<div>Debes <a href='/api/user/inicio-sesion'>inciar sesion</a> o <a href='/api/user/registro'>registrarte</a></div>")
//     }
// })



export { router as userRouter }