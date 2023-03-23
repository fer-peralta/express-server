export const checkCart = (req, res, next) => {
    if (req.user.cart) {
        next()
    }
    else {
        res.json({ message: `Please add a product in your cart` })
    }
}