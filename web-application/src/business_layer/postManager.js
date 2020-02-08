const postRepository = require('../dataaccess_layer/postRepository');

exports.getAllPosts = callback => {
    // authorization
    postRepository.getAllPosts((error, posts) => {
        callback(error, posts);
    });
};
exports.getPost = (id, callback) => {
    // authorization
    postRepository.getPost(id, (error, post) => {
        callback(error, post);
    });
};

exports.addPost = (post, callback) => {
    if (post.title.length < 5)
        callback('Title must be atleast 5 characters long');
    else if (post.title.length > 200)
        callback('Title cannot be more than 200 characters long');
    else if (post.description.length < 10)
        callback('The description must be atleast 10 characters long');
    else if (post.platform == '-') callback('You must choose a game!');
    else {
        console.log(post);
        postRepository.addPost(post, callback);
    }
};
