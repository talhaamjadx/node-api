exports.getPosts = (req, res, next) => {
    res.status(200).json({
        name: "talha"
    })
}

exports.createPosts = (req, res, next) => {
    console.log(req.body)
    res.status(201).json({
        status: 201,
        message: "Post Created"
    })
}