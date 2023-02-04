import twilio from "twilio"

const accountID = "ACba89d10d0058690612ad2727842be9a7"
const authToken = "276b27586e37a825a3f6187f14e46842"
export const adminPhone = "+13135461278"
export const twilioWhatsapp = "+14155238886"
export const adminWhatsapp = "+5491122854280"

export const twilioClient = twilio(accountID,authToken)