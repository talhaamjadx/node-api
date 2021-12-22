const { validationResult } = require("express-validator")
const Post = require("../../models/post");
const fs = require("fs");

exports.getPosts = (req, res, next) => {
    Post.find()
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
    Post.findById(req.params.id)
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
    Post.findById(req.params.id)
        .then(post => {
            removeImage(post.imageUrl)
            return Post.findByIdAndDelete(post._id)
        })
        .then(post => {
            res.status(200).json({
                success: true,
                message: "deleted",
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                errors: err
            })
        })
}

exports.postById = (req, res, next) => {
    Post.findById(req.params.id)
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
        imageUrl: req.file.path
    })
    post.save()
        .then(() => {
            res.status(201).json({
                status: 201,
                message: "Post Created"
            })
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