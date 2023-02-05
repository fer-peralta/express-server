import {UserManager} from "../persistence/models/index.js"

export const getUsers = async ()=>{
    return await UserManager.getAll();
}

export const saveUser = async(body)=>{
    return await UserManager.save(body)
}