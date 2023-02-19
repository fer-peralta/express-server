import axios from "axios";

const baseURL = "http://localhost:8080/api/products"

const testGetProducts = async () => {
    try {
        const response = await axios.get(`${baseURL}`)
        console.log(response.data)
    } catch (error) {
        throw new Error(error)
    }
}

const testGetByIdProducts = async () => {
    try {
        const response = await axios.get(`${baseURL}/1`)
        console.log(response.data)
    } catch (error) {
        throw new Error(error)
    }
}

const testPostProducts = async () => {
    try {
        // * It add a product
        const response = await axios.post(`${baseURL}`, {
            "name": "Campera",
            "price": 27000,
            "url": "campera.com"
        })
        console.log("Prueba hecha correctamente")
    } catch (error) {
        throw new Error(error)
    }
}

// * Uncomment to make the test
testGetProducts()
// testPostProducts()
testGetByIdProducts()