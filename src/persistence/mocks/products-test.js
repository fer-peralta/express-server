import faker from '@faker-js/faker'
import {commerce, datatype} from '@faker-js/faker'

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
