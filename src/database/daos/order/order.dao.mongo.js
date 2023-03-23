import { MongoManager } from '../../managers/Mongo.manager.js'

export class OrderMongoDao extends MongoManager {
    constructor(model) {
        super(model)
    }
}