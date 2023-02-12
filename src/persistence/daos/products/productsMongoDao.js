import { MongoContainer } from "../../managers/mongo.manager";

class ProductMongoDao extends MongoContainer() {
    constructor(model) {
        super(model)
    }
}

export { ProductMongoDao }