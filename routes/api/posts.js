const express = require("express");

const { body } = require("express-validator")

const router = express.Router();

const { getPosts, createPosts, postById, deletePost, updatePost } = require("../../controllers/api/posts")

router.get('/posts', getPosts)

router.get('/posts/:id', postById)

router.put('/posts/:id', [
    body("title").trim().isLength({ min: 5 })
], updatePost)

router.delete('/posts/:id', deletePost)

router.post('/posts/create', [
    body("title").trim().isLength({ min: 5 })
], createPosts)

module.exports = router