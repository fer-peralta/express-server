import { createTransport } from "nodemailer";

export const emailAdmin = "fernandoemanuelperalta@gmail.com"
const passwordAdmin = "ojczinbrnhglvbkb"

export const transporterEmail = createTransport({
    host:"smtp.gmail.com",
    port:587,
    auth:{
        user:emailAdmin,
        pass:passwordAdmin
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
})

