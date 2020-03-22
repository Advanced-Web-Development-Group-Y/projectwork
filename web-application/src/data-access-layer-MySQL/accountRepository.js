const con = require('./db-connect')
module.exports = ({}) => {
    return {
        getAccountById: (id, callback) => {
            const query =
                'SELECT id,email,username,firstname,lastname,permission_level,createdAt FROM accounts WHERE id = ?'
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
        updateAccount: (data, callback) => {
            const query = `UPDATE accounts 
        SET firstname = ?, 
        lastname = ?,
        email = ?,
        updatedAt = CURRENT_TIMESTAMP 
        WHERE id = ?`

            con.query(
                query,
                [data.firstname, data.lastname, data.email, data.id],
                error => {
                    callback(error)
                }
            )
        },
        deleteAccountById: (id, callback) => {
            const query = `DELETE FROM accounts WHERE id = ?`

            con.query(query, id, error => {
                callback(error)
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
                    if (error) callback(error, null)
                    else callback(null, registereduser.insertId)
                }
            )
        }
    }
}
