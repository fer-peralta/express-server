const fs = require("fs")

class Product {

    constructor(title, price, thumbnail){
        this.title = title
        this.price = price
        this.thumbnail = thumbnail
        this.id = 0  
    } 

}

module.exports = Product