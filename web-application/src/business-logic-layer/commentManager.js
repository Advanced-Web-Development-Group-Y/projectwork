module.exports = ({ commentRepository }) => {
    return {
        getPostCommentsByPostId: (id, callback) => {
            commentRepository.getPostCommentsByPostId(id, (error, comments) => {
                callback(error, comments)
            })
        },
        getCommentById: (id, callback) => {
            commentRepository.getCommentById(id, (error, comment) => {
                callback(error, comment)
            })
        },
        addComment: (comment, callback) => {
            if (!comment.content) callback('The comment must say something')
            else if (comment.content.length < 5)
                callback('The comment must be atleast 5 characters long')
            else if (!comment.posterid) callback('Provide a posterid')
            else if (!comment.postid) callback('Provide a postid')
            else {
                commentRepository.addComment(comment, callback)
            }
        },
        deleteCommentById: (information, callback) => {
            commentRepository.getCommentById(
                information.id,
                (error, comment) => {
                    if (error) callback(error)
                    else if (!information.isAdmin) callback('Not authorized')
                    else {
                        if (information.id <= -1) {
                            callback('Not a valid ID!')
                        } else {
                            commentRepository.deleteCommentById(
                                information.id,
                                callback
                            )
                        }
                    }
                }
            )
        },

        updateComment: (information, callback) => {
            commentRepository.getCommentById(
                information.id,
                (error, comment) => {
                    if (error) callback(error)
                    else if (comment[0].posterid !== information.userid) {
                        callback('Not authorized')
                    } else {
                        if (!information.content)
                            callback('The comment must say something')
                        else if (information.content.length < 5)
                            callback(
                                'The comment must be atleast 5 characters long'
                            )
                        else {
                            commentRepository.updateComment(
                                information,
                                callback
                            )
                        }
                    }
                }
            )
        }
    }
}
