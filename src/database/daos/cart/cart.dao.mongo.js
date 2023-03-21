import { MongoManager } from '../../managers/Mongo.manager.js'
import { loggerError } from '../../logs/loggers.js';
import { convertToDto } from '../../dtos/convertToDto.js';
import { CartDto } from '../../dtos/cart.dto.js';

export class CartMongoDao extends MongoManager {
    constructor(model) {
        super(model)
    }

    // async getAll() {
    //     try {
    //         const response = await this.model.find();
    //         const data = JSON.parse(JSON.stringify(response))
    //         const responseDto = convertToDto(data, CartDto)
    //         return responseDto;
    //     } catch (error) {
    //         loggerError.error({ message: `There was an error showing the documents: ${error}` })
    //         return { message: `There was an error showing the documents: ${error}` };
    //     }
    // }

    // async getById(id) {
    //     try {
    //         const documentToFind = await this.model.findById(id);
    //         if (!documentToFind) {
    //             return { message: `There was an error, ${id} not found`, error: true };
    //         } else {
    //             const responseDto = convertToDto(documentToFind, CartDto)
    //             return { message: `Document found succesfully`, data: responseDto, error: false };
    //         }
    //     } catch (error) {
    //         loggerError.error({ message: `There was an error searching the document with the id ${id}: ${error}` })
    //         return { message: `There was an error searching the document with the id ${id}: ${error}`, error: true };
    //     }
    // }

}