const express = require("express")
const app = express()

const router = require("./routes/index.js")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set("views", "./views")
app.set("view engine", "pug")

app.use("/", router)

app.listen(8080, ()=>{console.log("Server listening in 8080")})