const mongoose = require("mongoose");

const User = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        requied: true
    },
    posts: [
        {
            postId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "post"
            }
        }
    ]
},
{
    timestamps: true
})

module.exports = mongoose.model("user", User)