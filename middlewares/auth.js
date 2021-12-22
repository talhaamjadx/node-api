const jwt = require("jsonwebtoken")

exports.auth_middleware = (req, res, next) => {
    let token = req.get("Authorization")
    if (!token)
        res.status(401).json({
            message: "Unauthorized"
        })
    token = token.split(" ")[1]
    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.userId = decoded.userId
    }
    catch (err) {
        res.status(401).json({
            message: "Unauthorized",
            error: err
        })
    }
    next()
}