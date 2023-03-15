import * as dotenv from "dotenv";

dotenv.config()

//creamos la configuracion de nuestra aplicacion
export const config = {
    ADMIN_GMAIL: process.env.ADMIN_GMAIL,
    PASSWORD_GMAIL: process.env.PASSWORD_GMAIL,
    MONGO_DB: process.env.MONGO_DB,
    TWILIO_ACCOUNT_ID: process.env.TWILIO_ACCOUNT_ID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_ADMIN_PHONE: process.env.TWILIO_ADMIN_PHONE,
    TWILIO_WHATSAPP_PHONE: process.env.TWILIO_WHATSAPP_PHONE,
    ADMIN_WHATSAPP_PHONE: process.env.ADMIN_WHATSAPP_PHONE,
    DBTYPE: process.env.DBTYPE
};