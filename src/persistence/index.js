import {ContenedorChat} from './managers/ContenedorChat.js'
import { Containersql } from './managers/ContainerSql.js'
import { options } from '../config/dbConfig.js'

export const productApi = new Containersql(options.mariaDB, "products")
// const chatApi = new Containersql(options.sqliteDB,"chat")
export const chatApi = new ContenedorChat("chat.txt")