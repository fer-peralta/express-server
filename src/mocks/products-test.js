const { faker } = require('@faker-js/faker')
const {commerce, datatype} = faker

let productsTest = []

for(let i= 0; i<productsTest.length; i++){
    productsTest.push({
        id : datatype.uuid(),
        name : commerce.product(),
        price : commerce.price(),
        url : `${this.name}.jpg`
        
    })
}

module.exports = productsTest
