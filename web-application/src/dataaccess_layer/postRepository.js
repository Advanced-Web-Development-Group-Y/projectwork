const mysql = require('mysql');

//Connect to DB
const con = mysql.createConnection({
    host: 'database',
    user: 'root',
    port: '3306',
    password: 'elpassword123',
    database: 'webAppDatabase'
});

con.connect();

exports.getAllPosts = callback => {
    const query = 'SELECT * FROM posts';
    con.query(query, (error, posts) => {
        callback(error, posts);
    });
};
exports.getPost = (id, callback) => {
    const query = 'SELECT * FROM posts WHERE postid = ?';
    con.query(query, id, (error, posts) => {
        callback(error, posts);
    });
};

exports.addPost = (post, callback) => {
    const query =
        'INSERT INTO posts(title, content, posterid, platform)VALUES(?, ?, ?, ?);';
    con.query(
        query,
        [post.title, post.description, post.posterid, post.platform],
        error => {
            callback(error);
        }
    );
};

exports.updatePost = (post, callback) => {
    const query = `UPDATE posts 
        SET title = ?, 
        content = ?, 
        last_update = CURRENT_TIMESTAMP 
        WHERE postid = ?`;

    con.query(query, [post.title, post.content, post.postid], error => {
        callback(error);
    });
};

// These functions should be called in business_layer
