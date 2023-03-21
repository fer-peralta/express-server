import { loggerError, loggerInfo } from "../logs/loggers.js"
// import { convertToDto } from "../dtos/user.dto.js";
export class MongoManager {
    constructor(model) {
        this.model = model
    }

    async saveData(data) {
        try {
            const object = await this.model.create(data);
            return { message: `New document was saved`, id: object._id }
        } catch (error) {
            loggerError.error({ message: `There was an error saving the document: ${error}` })
            return { message: `There was an error saving the document: ${error}` };
        }
    }

    async getAll() {
        try {
            const response = await this.model.find();
            const data = JSON.parse(JSON.stringify(response))
            // const responseDto = convertToDto(data)
            return data;
        } catch (error) {
            loggerError.error({ message: `There was an error showing the documents: ${error}` })
            return { message: `There was an error showing the documents: ${error}` };
        }
    }

    async getById(id) {
        try {
            const documentToFind = await this.model.findById(id);
            if (!documentToFind) {
                return { message: `There was an error, ${id} not found`, error: true };
            } else {
                return { message: `Document found succesfully`, data: documentToFind, error: false };
            }
        } catch (error) {
            loggerError.error({ message: `There was an error searching the document with the id ${id}: ${error}` })
            return { message: `There was an error searching the document with the id ${id}: ${error}`, error: true };
        }
    }

    async updateById(id, body) {
        try {
            const documentToupdate = await this.model.findById(id)
            if (documentToupdate) {
                await this.model.findByIdAndUpdate(id, body)
                const newData = await this.getById(id)
                return { message: "Document update successfully", newData }
            }
            else {
                return { message: `There was an error, document with the id ${id} not found` }
            }
        } catch (error) {
            loggerError.error({ message: `There was an error updating the document with the id ${id}: ${error}` })
            return { message: `There was an error updating the document with the id ${id}: ${error}` };
        }
    }

    async deleteById(id) {
        try {
            const documentToDelete = await this.model.findById(id)
            if (documentToDelete) {
                await this.model.findByIdAndDelete(id)
                return { message: "Document deleted successfully" }
            }
            else {
                return { message: `There was an error, document with the id ${id} not found` }
            }
        } catch (error) {
            loggerError.error({ message: `There was an error deleting the document with the id ${id}: ${error}` })
            return { message: `There was an error deleting the document with the id ${id}: ${error}` };
        }
    }
}