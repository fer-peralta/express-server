import express from 'express'
import passport from 'passport'
import { getUsersController, findUserController } from '../../controllers/user.controller.js'
import { loggerInfo } from '../../database/logs/loggers.js'
import { signUpStrategy, logInStrategy } from '../middlewares/auth.middleware.js'
import { checkLogin } from '../middlewares/checkLogin.js'
loggerInfo
const router = express.Router()

passport.use('signupStrategy', signUpStrategy)
passport.use('loginStrategy', logInStrategy)

router.get('/', getUsersController)

router.get('/:id', findUserController)

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



router.post("/login", (req, res, next) => {
    // loggerInfo.info(req.body)
    passport.authenticate("loginStrategy", (error, user, info) => {
        if (error || !user) return res.json({ message: info.message })
        req.logIn(user, function (error) {
            console.log("entro al login")
            if (error) return res.json({ message: `Hubo un error al autenticar el usuario: ${error}` })
            // res.json({ user, message: info.message })
            res.json({ user })
        })
    })(req, res, next)
})


// router.get('/perfil', async (req, res) => {
//     if (req.isAuthenticated()) {
//         let { name } = req.user
//         res.render('form', { user: name })
//     } else {
//         res.send("<div>Debes <a href='/api/user/inicio-sesion'>inciar sesion</a> o <a href='/api/user/registro'>registrarte</a></div>")
//     }
// })

router.get("/profile", checkLogin, (req, res) => {
    res.status(200).json(
        {
            message: "Datos del usuario",
            Usuario: req.user
        })
})

router.get("/logout", (req, res) => {
    req.session.destroy()
    req.logOut((error) => {
        if (error) return res.status(400).json({ message: `Error al cerrar sesión: ${error}` })
        res.status(200).json({ message: `Sesión finalizada` })
    })
})

export { router as userRouter }