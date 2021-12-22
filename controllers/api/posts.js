const { validationResult } = require("express-validator")
const Post = require("../../models/post");
const User = require("../../models/user");
const fs = require("fs");

exports.getPosts = (req, res, next) => {
    Post.find({ createdBy: req.userId })
    .populate("createdBy")
        .then(posts => {
            res.status(200).json({
                success: true,
                message: "found",
                data: posts
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                errors: err
            })
        })
}

exports.updatePost = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    Post.findOne({ _id: req.params.id, createdBy: req.userId})
        .then(post => {
            if (!post) {
                throw new Error("Post not found")
            }
            post.title = req.body.title ? req.body.title : post.title
            if(req.file){
                removeImage(post.imageUrl)
            }
            post.imageUrl = req.file ? req.file.path : post.imageUrl
            return post.deleteOne()
        })
        .then(post => {
            res.status(200).json({
                success: true,
                message: "success",
                data: post
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                errors: err
            })
        })
}

exports.deletePost = (req, res, next) => {
    let postId = null
    Post.findOne({ _id: req.params.id, createdBy: req.userId})
        .then(post => {
            postId = post._id
            removeImage(post.imageUrl)
            return Post.findByIdAndDelete(post._id)
        })
        .then(() => {
            res.status(200).json({
                success: true,
                message: "deleted",
            })
            return User.findOne({_id: req.userId})
        })
        .then(user => {
            user.posts.pull(postId)
            return user.save()
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                errors: err
            })
        })
}

exports.postById = (req, res, next) => {
    Post.findOne({ _id: req.params.id, createdBy: req.userId})
    .populate("createdBy")
        .then(post => {
            res.status(200).json({
                success: true,
                message: "found",
                data: post
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                errors: err
            })
        })
}

exports.createPosts = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    if (!req.file) {
        return res.status(400).json({
            message: "Image File not  found"
        })
    }
    const post = new Post({
        title: req.body.title,
        imageUrl: req.file.path,
        createdBy: req.userId
    })
    post.save()
        .then(() => {
            res.status(201).json({
                status: 201,
                message: "Post Created"
            })
            require("../../socket").getIo().emit("name", { name: "talha" })
            return User.findOne({ _id: req.userId })
        })
        .then(user => {
            user.posts.push(post)
            return user.save()
        })
        .catch(err => {
            res.status(500).json({
                message: "Server error",
                errors: err
            })
        })
}

const removeImage = filepath => {
    fs.unlink(filepath, err => console.log(err))
}