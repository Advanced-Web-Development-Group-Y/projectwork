const mysql = require('mysql')

//Connect to DB
const con = mysql.createConnection({
    host: 'database',
    user: 'root',
    port: '3306',
    password: 'elpassword123',
    database: 'webAppDatabase'
})

con.connect()

exports.getAllPosts = callback => {
    const query = 'SELECT * FROM posts'
    con.query(query, (error, posts) => {
        callback(error, posts)
    })
}
exports.getPost = (id, callback) => {
    const query = 'SELECT * FROM posts WHERE postid = ?'
    con.query(query, id, (error, posts) => {
        callback(error, posts)
    })
}
// These functions should be called in business_layer