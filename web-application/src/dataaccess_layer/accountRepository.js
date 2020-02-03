const mysql = require('mysql')

//Connect to DB
const con = mysql.createConnection({
    host: 'database',
    user: 'root',
    port: '3306',
    password: 'elpassword123',
    database: 'webAppDatabase'
})

con.connect(error => {
    if (error) console.log(error)
    else console.log('Connected!')
})

exports.getAllAccounts = callback => {
    const query = 'SELECT * FROM Accounts'
    con.query(query, (error, accounts) => {
        callback(error, accounts)
    })
}
exports.getAllPosts = callback => {
    const query = 'SELECT * FROM posts'
    con.query(query, (error, posts) => {
        callback(error, posts)
    })
}
// These functions should be called in business_layer
