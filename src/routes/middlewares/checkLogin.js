export const checkLogin = (req, res, next) => {
    if (req.user) {
        next()
    }
    else {
        res.json({ message: `Please log in if you have an account, if not you have to sign up` })
    }
}