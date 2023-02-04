import twilio from "twilio"
import {config} from "../config/config.js"

const accountID = config.TWILIO_ACCOUNT_ID
const authToken = config.TWILIO_AUTH_TOKEN
export const adminPhone = config.TWILIO_ADMIN_PHONE
export const twilioWhatsapp = config.TWILIO_WHATSAPP_PHONE
export const adminWhatsapp = config.ADMIN_WHATSAPP_PHONE

export const twilioClient = twilio(accountID,authToken)