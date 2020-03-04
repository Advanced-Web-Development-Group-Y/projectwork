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
        else console.log('Accountrepository connected to DB!')
    })
    return {
        getAccountById: (id, callback) => {
            const query =
                'SELECT email,username,firstname,lastname,permission_level FROM accounts WHERE id = ?'
            con.query(query, id, (error, account) => {
                callback(error, account)
            })
        },
        getPasswordFromAccountByUsername: (username, callback) => {
            const query = 'SELECT password FROM accounts WHERE username = ?'
            con.query(query, username, (error, password) => {
                callback(error, password)
            })
        },
        getAccountByUsername: (username, callback) => {
            const query = 'SELECT * FROM accounts WHERE username = ?'
            con.query(query, username, (error, account) => {
                callback(error, account)
            })
        },
        register: (credentials, callback) => {
            const query =
                'INSERT INTO accounts(username,password,firstname,lastname,email)VALUES(?,?,?,?,?);'
            con.query(
                query,
                [
                    credentials.username,
                    credentials.password,
                    credentials.firstname,
                    credentials.lastname,
                    credentials.email
                ],
                (error, registereduser) => {
                    callback(error, registereduser.insertId)
                }
            )
        },

        getAllPostsByUser: (userid, callback) => {
            const query = `SELECT * FROM posts WHERE posterid = ?`
            con.query(query, userid, (error, posts) => {
                callback(error, posts)
            })
        }
    }
}
