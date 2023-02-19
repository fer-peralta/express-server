import axios from "axios";

const baseURL = "http//localhost:8080/api/products"

const testServerEndpoints = async () => {
    try {
        const response = await axios.get(`${baseURL}`)
        console.log(response.data)
    } catch (error) {
        throw new Error(error)
    }
}

testServerEndpoints()