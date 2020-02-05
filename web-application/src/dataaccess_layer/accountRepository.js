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
exports.getAccountById = (id, callback) => {
    const query =
        'SELECT email,username,firstname,lastname,reg_date,permission_level FROM accounts WHERE userid = ?'
    con.query(query, id, (error, account) => {
        callback(error, account)
    })
}
exports.getPasswordFromAccountByUsername = (username, callback) => {
    const query = 'SELECT password FROM accounts WHERE username = ?'
    con.query(query, username, (error, password) => {
        callback(error, password)
    })
}
exports.getAccountByUsername = (username, callback) => {
    const query = 'SELECT * FROM accounts WHERE username = ?'
    con.query(query, username, (error, account) => {
        callback(error, account)
    })
}
exports.register = (credentials, callback) => {
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
        error => {
            callback(error)
        }
    )
}

// These functions should be called in business_layer
