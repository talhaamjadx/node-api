const User = require("../../models/user");

const router = require("express").Router()

const { body } = require("express-validator")

const { createUser, login } = require("../../controllers/api/users")

router.post("/login", [
    body("email").isEmail().normalizeEmail().withMessage("Enter a valid email address")
], login)

router.post("/create",[
    body("email").isEmail().normalizeEmail().withMessage("Enter a valid email address")
    .custom((value) => {
        return User.findOne({ email: value})
        .then(user => {
            if(!user)
                return true
            else
                return Promise.reject("User against this email already exists")
        })
        .catch(err => {
            console.log(err)
            return Promise.reject(err)
        })
    }),
    body('password').trim().isLength({ min: 8 }).withMessage("Password must be at lease 8 characters long."),
    body("confirmPassword").trim().custom((value, { req }) => {
        if(req.body.password !== value)
            return Promise.reject("Passwords do not match")
        return true
    })
], createUser)

module.exports = router