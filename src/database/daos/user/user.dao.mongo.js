import { MongoManager } from '../../managers/Mongo.manager.js'

export class UserMongoDao extends MongoManager {
    constructor(model) {
        super(model)
    }
}