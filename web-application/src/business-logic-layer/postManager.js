module.exports = ({ postRepository, accountRepository }) => {
    return {
        getAllPosts: callback => {
            postRepository.getAllPosts((error, posts) => {
                callback(error, posts)
            })
        },
        getAllPostsByUser: (userid, callback) => {
            accountRepository.getAllPostsByUser(userid, (error, posts) => {
                callback(error, posts)
            })
        },
        getAllFilteredPosts: (query, callback) => {
            postRepository.getAllFilteredPosts(query, (error, posts) => {
                callback(error, posts)
            })
        },
        getPost: (id, callback) => {
            postRepository.getPost(id, (error, post) => {
                if (post.length > 0) {
                    callback(error, post)
                } else {
                    callback('Invalid id')
                }
            })
        },

        checkIfUsersPost: (postid, callback) => {
            postRepository.checkIfUsersPost(postid, (error, posterid) => {
                callback(error, posterid)
            })
        },

        addPost: (post, callback) => {
            if (
                !post.title ||
                !post.content ||
                !post.platform ||
                !post.currency ||
                !post.price
            )
                callback('Fill in all inputs')
            else if (post.title.length < 5)
                callback('Title must be atleast 5 characters long')
            else if (post.title.length > 200)
                callback('Title cannot be more than 200 characters long')
            else if (post.content.length < 10)
                callback('The content must be atleast 10 characters long')
            else if (post.platform.length < 1)
                callback('You must choose a platform!')
            else {
                postRepository.addPost(post, callback)
            }
        },

        updatePost: (post, callback) => {
            postRepository.getPost(post.postid, (error, fetchedPost) => {
                console.log(post.userid)
                if (error) {
                    callback(error)
                } else if (post.userid !== fetchedPost[0].posterid) {
                    callback('Not authorized')
                } else {
                    if (post.title.length < 5)
                        callback('Title must be atleast 5 characters long')
                    else if (post.title.length > 200)
                        callback(
                            'Title cannot be more than 200 characters long'
                        )
                    else if (post.content.length < 10)
                        callback(
                            'The description must be atleast 10 characters long'
                        )
                    else {
                        postRepository.updatePost(post, callback)
                    }
                }
            })
        },

        getAllPostsByUser: (userid, callback) => {
            postRepository.getAllPostsByUser(userid, (error, posts) => {
                callback(error, posts)
            })
        },
        deletePostById: (information, callback) => {
            postRepository.getPost(information.id, (error, fetchedPost) => {
                if (error) {
                    callback(error)
                } else if (information.userid !== fetchedPost[0].posterid) {
                    callback('Not authorized')
                } else {
                    if (information.id <= -1) {
                        callback('Not a valid ID!')
                    } else {
                        postRepository.deletePostById(information.id, callback)
                    }
                }
            })
        },

        incrementViewCountByPostId: (postid, callback) => {
            postRepository.incrementViewCountByPostId(postid, error => {
                callback(error)
            })
        }
    }
}
