import * as dotenv from "dotenv";

dotenv.config()

//creamos la configuracion de nuestra aplicacion
export const config = {
    SQLITE_DB: process.env.SQLITE_DB,
    MARIADB_HOST: process.env.MARIADB_HOST,
    MONGO_AUTENTICATION: process.env.MONGO_AUTENTICATION,
    MONGO_SESSION: process.env.MONGO_SESSION,
    PORT: process.env.PORT || 8080
};