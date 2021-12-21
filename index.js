require("dotenv").config()
const express = require("express")

const bodyParser = require("body-parser")

const apiRouter = require("./routes/api/posts");

const app = express();

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    next()
})

app.use('/api', apiRouter)

app.listen(process.env.PORT, () => console.log("server is running on port "+process.env.PORT))