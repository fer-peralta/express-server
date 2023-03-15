import { MongoManager } from '../../managers/Mongo.manager.js'

export class CartMongoDao extends MongoManager {
    constructor(model) {
        super(model)
    }
}