import path from 'path'
import {fileURLToPath} from 'url'
import { config } from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const options = {
    mariaDB:{
        client:"mysql",
        connection:{
            host:config.MARIADB_HOST,
            user:"root",
            password:"",
            database:"ecommerce"
        }
    },
    sqliteDB:{
        client:"sqlite3",
        connection:{
            filename: path.join(__dirname, config.SQLITE_DB)
        }
    }
}

export {options}