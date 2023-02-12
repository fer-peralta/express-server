import { ContenedorChat } from "../../managers/ContenedorChat.js"

class ChatSqlDao extends ContenedorChat {
    constructor(filename) {
        super(filename)
    }
}

export { ChatSqlDao }