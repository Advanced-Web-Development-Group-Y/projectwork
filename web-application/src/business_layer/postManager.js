const postRepository = require('../dataaccess_layer/postRepository')

exports.getAllPosts = callback => {
    // authorization
    postRepository.getAllPosts((error, posts) => {
        callback(error, posts)
    })
}
exports.getPost = (id, callback) => {
    // authorization
    postRepository.getPost(id, (error, post) => {
        callback(error, post)
    })
}
