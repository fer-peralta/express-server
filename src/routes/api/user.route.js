import express from 'express'
import passport from 'passport'
import { getUsers, findUser, saveUser } from '../../services/user.service.js'
import { signUpStrategy, logInStrategy } from '../middlewares/auth.middleware.js'
const router = express.Router()

passport.use('signupStrategy', signUpStrategy)
passport.use('loginStrategy', logInStrategy)

router.get('/inicio-sesion', (req, res) => {
    res.render('login')
})

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
    logger.info(req.body)
    passport.authenticate("loginStrategy", (error, user, info) => {
        if (error || !user) return res.json({ message: info.message })
        req.logIn(user, function (error) {
            if (error) return res.json({ message: `Hubo un error al autenticar el usuario: ${error}` })
            res.json({ user, message: info.message })
        })
    })(req, res, next)
})


router.get('/perfil', async (req, res) => {
    if (req.isAuthenticated()) {
        let { name } = req.user
        res.render('form', { user: name })
    } else {
        res.send("<div>Debes <a href='/api/user/inicio-sesion'>inciar sesion</a> o <a href='/api/user/registro'>registrarte</a></div>")
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    setTimeout(() => {
        res.redirect('./inicio-sesion')
    }, 3000)
})

export { router as UserRouter }