const mysql = require('mysql')
const config = {
    host: 'database',
    user: 'root',
    port: '3306',
    password: 'elpassword123',
    database: 'webAppDatabase'
}
var connection = mysql.createPool(config)
connection.getConnection(error => {
    if (error) console.log("Couldn't connect to database")
    else console.log('Connected to database')
})
const reconnect = connection => {
    connection = mysql.createPool(config)
    connection.getConnection(error => {
        if (error) setTimeout(reconnect(connection), 5000)
        else {
            console.log('Connected to db')
            return connection
        }
    })
}

connection.on('error', error => {
    if (error) return reconnect(connection)
})

module.exports = connection
