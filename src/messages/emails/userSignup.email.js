import { transporterEmail } from "../email.js"
import { emailAdmin } from "../email.js"
import { loggerError, loggerInfo } from "../../database/logs/loggers.js"

export const signUpMail = (user) => {
    transporterEmail.sendMail({
        from: "Server node",
        to: emailAdmin,
        subject: "Nuevo registro",
        text: `El usuario ${user.username} se registró exitosamente`
    }, (error, response) => {
        if (error) {
            loggerError.error("There was an error sending the mail", error)
        } else {
            loggerInfo.info("An email with the user information was sended to the Admin")
        }
    })
} 