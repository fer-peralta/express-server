import {} from "../persistence/managers/ContainerSql.js"

export const getProducts = async() =>{
    return await Containersql.getAll()
}