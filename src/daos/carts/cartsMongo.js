import {ContenedorMongo} from '../../managers/ContenedorMongo.js'

class CarritoDaosMongo extends ContenedorMongo{
    constructor(carritoCollection, carritoSchema){
        super(carritoCollection, carritoSchema)
    }
}
export{CarritoDaosMongo}