const express = require("express");

const { body } = require("express-validator")

const { auth_middleware } = require("../../middlewares/auth")

const router = express.Router();

const { getPosts, createPosts, postById, deletePost, updatePost } = require("../../controllers/api/posts")

router.get('/posts', auth_middleware, getPosts)

router.get('/posts/:id', auth_middleware, postById)

router.put('/posts/:id', auth_middleware, [
    body("title").trim().isLength({ min: 5 })
], updatePost)

router.delete('/posts/:id', auth_middleware, deletePost)

router.post('/posts/create', auth_middleware, [
    body("title").trim().isLength({ min: 5 })
], createPosts)

module.exports = router