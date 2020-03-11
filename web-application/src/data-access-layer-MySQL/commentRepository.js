const con = require('./db-connect')
module.exports = ({}) => {
    return {
        getPostCommentsByPostId: (id, callback) => {
            const query = 'SELECT * FROM comments WHERE postid = ?'
            con.query(query, id, (error, comments) => {
                callback(error, comments)
            })
        },
        getCommentById: (id, callback) => {
            const query = 'SELECT * FROM comments WHERE id = ?'
            con.query(query, id, (error, comment) => {
                callback(error, comment)
            })
        },
        deleteCommentById: (id, callback) => {
            const query = `DELETE FROM comments WHERE id = ?`

            con.query(query, id, error => {
                callback(error)
            })
        },
        updateComment: (comment, callback) => {
            const query = `UPDATE comments SET content = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`

            con.query(query, [comment.content, comment.id], error => {
                callback(error)
            })
        },
        addComment: (comment, callback) => {
            const query =
                'INSERT INTO comments(content, posterid,posterusername, postid)VALUES(?, ?, ?,?);'
            con.query(
                query,
                [
                    comment.content,
                    comment.posterid,
                    comment.posterusername,
                    comment.postid
                ],
                error => {
                    callback(error)
                }
            )
        }
    }
}
