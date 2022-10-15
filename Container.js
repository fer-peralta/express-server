const fs = require("fs")
const Product = require("./Product")

class Container {

    constructor(file) {
        this.file = file
    }
    
    //Save product
    save = async (product) => {
        try {
            if (fs.existsSync(this.file)) { //If the file exist
                const content = await fs.promises.readFile(this.file, "utf-8")
                if(content) { //If the file has content
                    const products = JSON.parse(content)

                    const newProduct = {
                        ...product,
                        id: products.length+1
                    }
                    
                    const productExist = products.some(item => item.id == newProduct.id) //ver si existe

                    if(productExist) { //If the product new product id is used by other product 
                        newProduct.id +1
                    }
                    else { //if doesn't
                        products.push(newProduct)
                        await fs.promises.writeFile(this.file, JSON.stringify(products, null, 2))
                    }
                }
                else { //If the file doesn't has content
                    const firstProduct = {
                        ...product,
                        id: 1
                    }
                    await fs.promises.writeFile(this.file, JSON.stringify([firstProduct], null, 2))
                }                
            }
            else { //If the file doesn't exist
                const firstProduct = {
                    ...product,
                    id: 1
                }
                await fs.promises.writeFile(this.file, JSON.stringify([firstProduct], null, 2))
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    // Get an element by id
    getById = async(id) => {
        try {
            if(fs.existsSync(this.file)) { //If the file exist
                const content = await fs.promises.readFile(this.file, "utf-8")
                if(content) {
                    const products = JSON.parse(content)
                    const product = products.find(item => item.id == id)
                    return product
                }
                
                else { //If the file doesn't has content
                    console.log("No hay ningún producto para buscar")
                }
            }
            else { //If the file doesn't exist
                console.log("No existe el archivo")
            }
        }
        catch(error) {
            console.log(error)
        }
        
    }

    //Get all elements
    getAll = async() => {
        try {
            if(fs.existsSync(this.file)) { //If the file exist
                const content = await fs.promises.readFile(this.file, "utf-8")
                const products = JSON.parse(content)
                return products
            }
            else { //If the file doesn't exist
                console.log("No existe el archivo")
            }   
        }
        catch(error) {
            console.log(error)
        }
          
    }

    //Delete an element by id
    deleteById = async(id) => {
        try {
            if(fs.existsSync(this.file)) { //If the file exist
                const content = await fs.promises.readFile(this.file, "utf-8")
                const products = JSON.parse(content)
                const newArray = products.filter(item => item.id != id) //Filtering the array
                await fs.promises.writeFile(this.file, JSON.stringify(newArray, null, 2))
                console.log("\nSe eliminó el elemento seleccionado\n")
            }
            else { //If the file doesn't exist
                console.log("No existe el archivo")
            }  
        }
        catch(error) {
            console.log(error)
        }
        
    }

    //Delete all the elements of the file
    deleteAll = async () => {
        try {//If the file exist
            fs.existsSync(this.file) ? await fs.promises.writeFile(this.file, "") : console.log("No existe el archivo")
        }
        catch(error) {
            console.log(error)
        }
    }

    updateById = async(id, body) => {
        try {
            const listOfProducts = await this.getAll()
            const selected = listOfProducts.findIndex(el => el.id === id)
            listOfProducts[selected] = {
                id: id,
                ...body
            }
            await fs.promises.writeFile(this.file, JSON.stringify(listOfProducts, null, 2))
            return listOfProducts
        }
        catch(error) {
            console.log(error)
        }
    }

}

// Exporting the class
module.exports = Container

//Creates an instance of Container
const container1 = new Container("./file.txt") 

//Creates all products
const product1 = new Product("Remera", "3500", "./remera")
const product2 = new Product("Pantalon", "8500", "./pantalon")
const product3 = new Product("Zapatillas", "15700", "./zapatillas")

const createProduct = async() => {
    // Saving products
    await container1.save(product1)
    await container1.save(product2)
    await container1.save(product3)
}

createProduct()