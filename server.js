const express = require("express")
const app = express()

const router = require("./routes/index.js")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const handlebars = require("express-handlebars")

app.engine("handlebars", handlebars.engine())
app.set("views", "./views")
app.set("view engine", "handlebars")

app.use("/", router)

app.listen(8080, ()=>{console.log("Server listening in 8080")})