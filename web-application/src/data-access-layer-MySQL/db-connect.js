const mysql = require('mysql')
const con = mysql.createConnection({
    host: 'database',
    user: 'root',
    port: '3306',
    password: 'elpassword123',
    database: 'webAppDatabase'
})
con.connect(error => {
    if (error) console.log(error)
    else console.log('Connected to db')
})

module.exports = con
