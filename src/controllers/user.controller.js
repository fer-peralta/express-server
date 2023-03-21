import { getUsers, saveUser, findUser, updateUser } from "../services/user.service.js";
import passport from 'passport'
import { signUpStrategy, logInStrategy } from '../routes/middlewares/auth.middleware.js'

passport.use('signupStrategy', signUpStrategy)
passport.use('loginStrategy', logInStrategy)

export const getUsersController = async (req, res) => {
    try {
        const response = await getUsers();
        res.status(200).json({ data: response });
    } catch (error) {
        res.status(400).json({ message: `Hubo un error ${error}` });
    }
}

export const SignUpUserController = async (req, res) => {
    try {
        const response = await saveUser(req.body);
        res.status(200).json({ data: response });
    } catch (error) {
        res.status(400).json({ message: `Hubo un error ${error}` });
    }
}

export const findUserController = async (req, res) => {
    try {
        const response = await findUser(req.params.id);
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ message: `Hubo un error ${error}` })
    }
}
export const logInUserController = async (req, res, next) => {
    // loggerInfo.info(req.body)
    passport.authenticate("loginStrategy", (error, user, info) => {
        if (error || !user) return res.json({ message: info.message })
        req.logIn(user, function (error) {
            console.log("Usuario logueado")
            if (error) return res.json({ message: `Hubo un error al autenticar el usuario: ${error}` })
            // res.json({ user, message: info.message })
            res.json({ user })
        })

    })(req, res, next)
}

export const logOutUserController = async (req, res) => {
    req.session.destroy()
    req.logOut((error) => {
        if (error) return res.status(400).json({ message: `Error al cerrar sesión: ${error}` })
        res.status(200).json({ message: `Sesión finalizada` })

    })
}
export const profileUserController = async (req, res) => {
    console.log(req.user)
    res.status(200).json({
        message: "Datos del usuario",
        Usuario: req.user
    })
}

// export const findOneController = async (req, done) => {
//     const { username } = req.body.email
//     try {
//         const existe = await findUser(username)
//         console.log(existe);
//         await findUser({ username: username }, (error, userFound) => {
//             if (error) return done(error, null, { message: 'hubo un error' })
//             if (userFound) return done(null, null, { message: 'el usuario existe' })
//             const newUser = {
//                 name: req.body.name,
//                 username: req.body.username,
//                 password: createHash(req.body.password),
//                 telephone: req.body.telephone,
//                 address: req.body.adress,
//                 age: req.body.age,
//                 avatar: req.body.avatar
//             }
//             createUser(newUser, (error, userCreated) => {
//                 if (error) return done(error, null, { message: 'error al registrar' })
//                 return done(null, userCreated, { message: 'usuario creado' })
//             })
//         })

//     } catch (error) {
//         console.log((error));
//     }
// }