import { transporterEmail } from "../email.js"
import { emailAdmin } from "../email.js"
import { loggerError, loggerInfo } from "../../database/logs/loggers.js"

export const adminOrderEmailSend = (user, order) => {
    transporterEmail.sendMail({
        from: "Server node",
        to: emailAdmin,
        subject: `Nuevo pedido de ${user.name, user.username}`,
        text: `${JSON.stringify(order)}`
    }, (error) => {
        if (error) {
            loggerError.error(`There was an error sending the mail to the admin: ${error}`)
        } else {
            loggerInfo.info("A new order is in process, an email with the order was sended to the admin")
        }
    }
    )
}
