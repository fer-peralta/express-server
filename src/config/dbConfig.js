import {config} from "./config.js"

export const options = {
    MongoDB:{
        url: config.MONGO_DB,
        urlSession: config.MONG_DB_SESSION
    }
}