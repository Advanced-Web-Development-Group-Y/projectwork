module.exports = ({ postRepository }) => {
    return {
        getAllPosts: (request, callback) => {
            if (request.session.isLoggedIn)
                postRepository.getAllPosts((error, posts) => {
                    callback(error, posts)
                })
            else callback('You are not authorized for this.')
        },
        getPost: (id, callback) => {
            // authorization
            postRepository.getPost(id, (error, post) => {
                callback(error, post)
            })
        },

        checkIfUsersPost: (postid, callback) => {
            postRepository.checkIfUsersPost(postid, (error, posterid) => {
                callback(error, posterid)
            })
        },

        addPost: (post, callback) => {
            if (post.title.length < 5)
                callback('Title must be atleast 5 characters long')
            else if (post.title.length > 200)
                callback('Title cannot be more than 200 characters long')
            else if (post.description.length < 10)
                callback('The description must be atleast 10 characters long')
            else if (post.platform == '-') callback('You must choose a game!')
            else {
                postRepository.addPost(post, callback)
            }
        },

        updatePost: (post, callback) => {
            if (post.title.length < 5)
                callback('Title must be atleast 5 characters long')
            else if (post.title.length > 200)
                callback('Title cannot be more than 200 characters long')
            else if (post.content.length < 10)
                callback('The description must be atleast 10 characters long')
            else {
                postRepository.updatePost(post, callback)
            }
        },

        deletePostById: (id, callback) => {
            if (id <= -1) {
                callback('Not a valid ID!')
            } else {
                postRepository.deletePostById(id, callback)
            }
        },

        getAllPostsByUser: (userid, callback) => {
            postRepository.getAllPostsByUser(userid, (error, posts) => {
                callback(error, posts)
            })
        },

        incrementViewCountByPostId: (postid, callback) => {
            postRepository.incrementViewCountByPostId(postid, error => {
                callback(error)
            })
        }
    }
}
