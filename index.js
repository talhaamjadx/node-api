require("dotenv").config()
const express = require("express")

const bodyParser = require("body-parser")

const apiRouter = require("./routes/api/posts");

const multer = require("multer")

const path = require("path");

const userRouter = require("./routes/api/users");

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images")
    },
    filename: (req, file, callback) => {
        callback(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname)
    }
})

const fileFilter = (req, file, callback) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg")
        callback(null, true)
    else
        callback(null, false)
}

const mongoose = require("mongoose");

app.set("views", "views")

app.set("view engine", "ejs")

app.use(bodyParser.json())

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"))

app.use("/images", express.static(path.join(__dirname, "images")))

app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    next()
})

app.get("/home", (req, res, next) => {
    res.render("index")
})

app.use('/api', apiRouter)

app.use('/api/users', userRouter)

mongoose.connect(process.env.MONGO_DB_KEY)
    .then(() => {
        const server = app.listen(process.env.PORT, () => console.log("server is running on port " + process.env.PORT))
        require("./socket.js").init(server)
        const io = require("./socket.js").getIo()
        io.on("connection", socket => {
            console.log("Socket is connected")
        })
    })
    .catch(err => {
        console.log(err)
    })