const mongoose = require("mongoose");

const Post = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("post", Post)