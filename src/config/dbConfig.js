import path from 'path'
import { fileURLToPath } from 'url'
import { config } from './config.js'
import mongoose from 'mongoose'
import { logger } from '../logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const options = {
    mariaDB: {
        client: "mysql",
        connection: {
            host: config.MARIADB_HOST,
            user: "root",
            password: "",
            database: "ecommerce"
        }
    },
    sqliteDB: {
        client: "sqlite3",
        connection: {
            filename: path.join(__dirname, config.SQLITE_DB)
        }
    }
}

export const MongoDB = () => {
    mongoose.set('strictQuery', false)
    mongoose.connect(config.MONGO_AUTENTICATION, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {
        if (err) return logArchivoError.error(`hubo un error: ${err}`);
        logger.info('conexion a base de datos exitosa');
    })
}


export { options }