import {ContenedorMongo} from '../../managers/ContenedorMongo.js'

class ProductosDaosMongo extends ContenedorMongo{
    constructor(collection,schema){
        super(collection,schema)
    }
}
export{ProductosDaosMongo}