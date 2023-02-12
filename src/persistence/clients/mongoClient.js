import mongoose from "mongoose";
import { config } from '../../config/config.js'
import { logger } from "../../logger.js";

export class MongoClient {
    constructor() {
        this.client = mongoose
    }

    async connect() {
        try {
            await this.client.connect(config.MONGO_AUTENTICATION)
            logger.info("Conexión exitosa a MongoDB")
        } catch (error) {
            throw new Error(`Hubo un error al conectarse a MongoDB ${error}`)
        }
    }

    async disconnect() {
        try {
            await this.client.connection.close()
            logger.info("Se ha desconectado exitosamente de MongoDB")
        } catch (error) {
            throw new Error(`Hubo un error al desconectarse de MongoDB ${error}`)
        }
    }
}
