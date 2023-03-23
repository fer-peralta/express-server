import { loggerInfo, loggerError } from "../../database/logs/loggers.js"
import { twilioClient, twilioWhatsapp, adminWhatsapp } from "../sms.js"

export const adminOrderWPSend = (user) => {
    twilioClient.messages.create({
        body: `Nuevo pedido de ${user.name, user.username}`,
        from: `whatsapp:${twilioWhatsapp}`,
        to: `whatsapp:${adminWhatsapp}`,
    }, (error) => {
        if (error) {
            loggerError.error(`There was an error sending the message to the admin: ${error}`)
        } else {
            loggerInfo.info("A new whatsapp message was sended to the admin")
        }
    }
    )
}
