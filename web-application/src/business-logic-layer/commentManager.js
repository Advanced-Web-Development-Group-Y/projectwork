module.exports = ({ commentRepository }) => {
    return {
        getPostCommentsByPostId: (id, callback) => {
            commentRepository.getPostCommentsByPostId(id, (error, comments) => {
                callback(error, comments)
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
        }
    }
}
