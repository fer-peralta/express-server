import { config } from "../../config/config.js"
import mongoose from "mongoose";
import { loggerError, loggerInfo } from "../logs/loggers.js";

export class MongoClient {
    constructor() {
        this.client = mongoose
        this.URL = config.MONGO_DB
    }

    async connect() {
        try {
            this.client.set('strictQuery', false)
            await this.client.connect(this.URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            loggerInfo.info("Conexión exitosa a MongoDB")
        } catch (error) {
            loggerError.error(`Hubo un error al conectarse a MongoDB ${error}`)
        }
    }

    async disconnect() {
        try {
            await this.client.connection.close()
            logger.info("Se ha desconectado exitosamente de MongoDB")
        } catch (error) {
            loggerError.error(`Hubo un error al desconectarse de MongoDB ${error}`)
        }
    }
}