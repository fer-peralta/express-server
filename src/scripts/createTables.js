const options = require ("../config/dbConfig")
const knex = require("knex")

const database = knex(options.mariaDB)
const dbSqlite = knex(options.sqliteDB)

// * If the table products doesn't exist, it creates it
const createTable = async() => {
    const products = await database.schema.hasTable("products") 

    if(products){
        await database.schema.dropTable("products")
        .then(()=> console.log("Table products dropped"))
        .finally(()=>database.destroy())
    }
    else {
        await database.schema.createTable("products", table=>{
            table.increments("id")
            table.string("name", 30).nullable(false)
            table.integer("price")
            table.string("url", 200)
        }).then(()=> console.log("Table products created"))
        .catch(err=>console.log(err))
        .finally(()=>database.destroy())
    }
    try {
        const tableChatExists = await dbSqlite.schema.hasTable("chat");
        if(tableChatExists){
            await dbSqlite.schema.dropTable("chat")
        }
        await dbSqlite.schema.createTable("chat", table=>{
            //campos de la tabla chat
            table.increments("id");
            table.string("userEmail",30);
            table.string("timestamp", 10);
            table.string("message",200);
        });
        console.log("chat table created");
        dbSqlite.destroy();
    } catch (error) {
        console.log(error)
    }
     
}

createTable()