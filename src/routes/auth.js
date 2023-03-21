authRouter.post("/signup", (req, res) => {
    passport.authenticate("signUpStrategy", (error, user, info) => {
        if (error || !user) return res.json({ message: info.message })
        req.logIn(user, function (error) {
            if (error) return res.json({ message: `Hubo un error al autenticar el usuario: ${error}` })
            transporterEmail.sendMail({
                from: "Server node",
                to: emailAdmin,
                subject: "Nuevo registro",
                text: `El usuario ${user.username} se registró exitosamente`
            }, (error, response) => {
                if (error) {
                    logger.error("Hubo un error al enviar el mensaje al admin")
                } else {
                    logger.info("Se ha registrado un usuario")
                }
            }
            )
            res.json({ user, message: info.message })
        })
    })(req, res)
})

// authRouter.get("/home", checkLogin,(req,res)=>{
//     res.send("Home")
// })

// authRouter.post("/login",(req,res,next)=>{
//     logger.info(req.body)
//     passport.authenticate("loginStrategy",(error, user, info)=>{
//         if(error || !user) return res.json({message:info.message})
//         req.logIn(user, function(error){
//             if(error) return res.json({message:`Hubo un error al autenticar el usuario: ${error}`})
//             res.json({user, message:info.message})
//         })
//     })(req, res, next)
// })

// authRouter.get("/profile",checkLogin,(req,res)=>{
//     res.status(200).json(
//     {   message: "Datos del usuario",
//         Usuario: req.user
//     })
// })

// authRouter.post("/logout",(req,res)=>{
//     req.logOut((error)=>{
//         if(error) return res.status(400).json({message:`Error al cerrar sesión: ${error}`})
//         res.status(200).json({message: `Sesión finalizada`})
//     })
// })

// export {authRouter}