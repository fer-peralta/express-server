import { getUsers, saveUser, findUser, updateUser } from "../services/user.service.js";

export const getUsersController = async (req, res) => {
    try {
        const response = await getUsers();
        res.status(200).json({ data: response });
    } catch (error) {
        res.status(400).json({ message: `Hubo un error ${error}` });
    }
}

export const saveUserController = async (req, res) => {
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