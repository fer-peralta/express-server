import { loggerInfo, loggerError } from "../../database/logs/loggers.js"
import { twilioClient, adminPhone } from "../sms.js"

export const userOrderSMSSend = (user) => {
    twilioClient.messages.create({
        body: "Tu pedido ha sido recibido y se encuentra en proceso",
        from: adminPhone,
        // to:"+541122854280"
        to: user.telephone
    }, (error) => {
        if (error) {
            loggerError.error(`There was an error sending the SMS to the user: ${error}`)
        } else {
            loggerInfo.info("A SMS was sended to the user with his order")
        }
    }
    )
}

