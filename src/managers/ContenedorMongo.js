import mongoose from 'mongoose'

class ContenedorMongo {
    constructor(collection, schema){
        this.model = mongoose.model(collection, schema)
    }

    async getById(id){
        try{
            const data = await this.model.findById(id)
            return data
        }catch(err){
            console.log(err);
        }
    }

    async getAll(){
        try{
            const data = await this.model.find()
            return data
        }catch(err){
            console.log(err);
        }
    }

    async save(data){
        try{
            const newData = await this.model.create(data)
            return newData
        }catch(err){
            console.log(err);
        }
    }
    async newId(){
        try{
            let id = new mongoose.Types.ObjectId()
            const data = await this.model.insertOne({'id':id})
            return data
        }catch(err){
            console.log(err);
        }
    }
    async putById(id,modificacion){
        try{
            const data = await this.model.findByIdAndUpdate(id,modificacion)
            const newData = await this.getById(id)
            return newData
        }catch(err){
            console.log(err);
        }
    }

    async moreProd(id,modificacion){
        try{
            return this.putById(id,modificacion)
        }catch(err){
            console.log(err);
        }
    }

    async deleteById(id){
        try{
            const data = await this.model.findByIdAndDelete(id)
            return data

        }catch(err){
            console.log(err);
        }
    }
    async deleteOneProd(id,id_prod){
        try{
            const data = await this.model.findOneAndUpdate(
                {'_id':id},
                {$pull: {subdocumentsArray:{'_id':id_prod}}},
                {new:true},
                function(err) {
                    if (err) { console.log(err) }
                })
            return data
        }catch(err){
            console.log(err);
        }
    }
}
export{ContenedorMongo}