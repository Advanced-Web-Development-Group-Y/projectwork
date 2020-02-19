const mysql = require('mysql')

module.exports = ({}) => {
    const con = mysql.createConnection({
        host: 'database',
        user: 'root',
        port: '3306',
        password: 'elpassword123',
        database: 'webAppDatabase'
    })
    con.connect(error => {
        if (error) console.log(error)
        else console.log('Postrepository connected to DB!')
    })
    return {
        getAllPosts: callback => {
            const query = 'SELECT * FROM posts'
            con.query(query, (error, posts) => {
                callback(error, posts)
            })
        },
        getPost: (id, callback) => {
            const query = 'SELECT * FROM posts WHERE postid = ?'
            con.query(query, id, (error, posts) => {
                callback(error, posts)
            })
        },

        addPost: (post, callback) => {
            const query =
                'INSERT INTO posts(title, content, posterid, platform)VALUES(?, ?, ?, ?);'
            con.query(
                query,
                [post.title, post.description, post.posterid, post.platform],
                error => {
                    callback(error)
                }
            )
        },

        updatePost: (post, callback) => {
            const query = `UPDATE posts 
        SET title = ?, 
        content = ?, 
        last_update = CURRENT_TIMESTAMP 
        WHERE postid = ?`

            con.query(query, [post.title, post.content, post.postid], error => {
                callback(error)
            })
        },

        deletePostById: (id, callback) => {
            const query = `DELETE FROM posts 
        WHERE postid = ?`

            con.query(query, id, error => {
                callback(error)
            })
        },

        checkIfUsersPost: (postid, callback) => {
            const query = `SELECT posterid 
        FROM posts
        WHERE postid = ?`

            con.query(query, postid, (error, posterid) => {
                callback(error, posterid)
            })
        },

        getAllPostsByUser: (userid, callback) => {
            const query = `SELECT * FROM posts WHERE posterid = ?`

            con.query(query, userid, (error, posts) => {
                callback(error, posts)
            })
        },

        incrementViewCountByPostId: (postid, callback) => {
            let query = `SELECT views FROM posts WHERE postid = ?`

            con.query(query, postid, (error, viewCount) => {
                let count = viewCount[0].views + 1
                query = `UPDATE posts SET views = ? WHERE postid = ?`

                con.query(query, [count, postid], error => {
                    callback(error)
                })
            })
        }
    }
}
