import {ContenedorChat} from './managers/ContenedorChat.js'
import { Containersql } from './managers/ContainerSql.js'
import { options } from '../config/dbConfig.js'
import {MongoContainer} from "./managers/mongo.manager.js"
import {UserModel} from "./models/users.js"

export const productApi = new Containersql(options.mariaDB, "products")
// const chatApi = new Containersql(options.sqliteDB,"chat")
export const chatApi = new ContenedorChat("chat.txt")


export const UserManager = new MongoContainer(UserModel);