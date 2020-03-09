const con = require('./db-connect')

module.exports = ({}) => {
    return {
        getAllPosts: callback => {
            const query = 'SELECT * FROM posts'
            con.query(query, (error, posts) => {
                callback(error, posts)
            })
        },
        getPost: (id, callback) => {
            const query = 'SELECT * FROM posts WHERE id = ?'
            con.query(query, id, (error, posts) => {
                callback(error, posts)
            })
        },

        addPost: (post, callback) => {
            const query =
                'INSERT INTO posts(title, content, posterid, platform,currency,price)VALUES(?, ?, ?, ?,?,?);'
            con.query(
                query,
                [
                    post.title,
                    post.content,
                    post.posterid,
                    post.platform,
                    post.currency,
                    post.price
                ],
                error => {
                    callback(error)
                }
            )
        },

        updatePost: (post, callback) => {
            const query = `UPDATE posts 
        SET title = ?, 
        content = ?,
        currency = ?,
        price = ?,
        updatedAt = CURRENT_TIMESTAMP 
        WHERE id = ?`

            con.query(
                query,
                [
                    post.title,
                    post.content,
                    post.currency,
                    post.price,
                    post.postid
                ],
                error => {
                    callback(error)
                }
            )
        },

        deletePostById: (id, callback) => {
            const query = `DELETE FROM posts 
        WHERE id = ?`

            con.query(query, id, error => {
                callback(error)
            })
        },

        getAllPostsByUser: (userid, callback) => {
            const query = `SELECT * FROM posts WHERE posterid = ?`

            con.query(query, userid, (error, posts) => {
                callback(error, posts)
            })
        },

        incrementViewCountByPostId: (postid, callback) => {
            let query = `SELECT views FROM posts WHERE id = ?`

            con.query(query, postid, (error, viewCount) => {
                if (error) {
                    callback(error)
                } else {
                    let count = viewCount[0].views + 1
                    query = `UPDATE posts SET views = ? WHERE id = ?`

                    con.query(query, [count, postid], error => {
                        callback(error)
                    })
                }
            })
        }
    }
}
