import { MongoManager } from '../../managers/Mongo.manager.js'

export class ProductMongoDao extends MongoManager {
    constructor(model) {
        super(model)
    }
}