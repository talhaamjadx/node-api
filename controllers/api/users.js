const crypto = require("crypto")

const { validationResult } = require("express-validator")

const jwt = require("jsonwebtoken")

const User = require("../../models/user")

exports.login = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            message: "Error",
            errors: errors
        })
    }
    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(!user)
            return Promise.reject("User not found against this email")
        const hashedPassword = crypto.createHmac("sha256", process.env.ENCRYPTION_KEY).update(req.body.password).digest("hex")
        if(hashedPassword === user.password){
            const token = jwt.sign({
                email: user.email,
                userId: user._id.toString()
            }, process.env.JWT_SECRET_KEY, {
                expiresIn: 60*60
            })
            return res.status(200).json({
                success: true,
                message: "found",
                token: token,
            })
        }
        else
            return Promise.reject("Password is incorrect")
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "error",
            error: err
        })
    })
}

exports.createUser = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            message: "Error",
            errors: errors
        })
    }
    const hashedPassword = crypto.createHmac("sha256", process.env.ENCRYPTION_KEY).update(req.body.password).digest("hex")
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
    })
    user.save()
    .then(userData => {
        res.status(201).json({
            success: true,
            message: "created",
            data: userData
        })
    })
    .catch(err => {
        res.send(500).json({
            success: false,
            message: "error",
            error: err
        })
    })
}