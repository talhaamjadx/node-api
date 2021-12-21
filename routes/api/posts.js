const express = require("express");

const router = express.Router();

const { getPosts, createPosts } = require("../../controllers/api/posts")

router.get('/posts', getPosts)

router.post('/posts/create', createPosts)

module.exports = router