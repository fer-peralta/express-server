import { createTransport } from "nodemailer";
import { config } from '../config/config.js'

export const emailAdmin = config.ADMIN_GMAIL
const passwordAdmin = config.PASSWORD_GMAIL

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

