class Product {

    id

    constructor(name, price, url, stock, description){
        this.timestamp = Date.now()
        this.name = name
        this.price = price
        this.url = url
        this.stock = stock
        this.description = description

    } 

}

module.exports = Product