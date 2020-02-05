const accountRepository = require('../dataaccess_layer/accountRepository')
const bcrypt = require('bcrypt')
const saltRounds = 10

exports.register = (credentials, callback) => {
    if (credentials.password !== credentials.confirmpassword)
        callback('Passwords dont match.')
    else if (credentials.password < 6) callback('Password is to short')
    else {
        bcrypt.genSalt(saltRounds, (error, salt) => {
            bcrypt.hash(credentials.password, salt, (error, hash) => {
                if (error) {
                    callback('ERROR')
                } else {
                    credentials.password = hash
                    accountRepository.register(credentials, callback)
                }
            })
        })
    }
}
exports.getAccountById = (id, callback) => {
    accountRepository.getAccountById(id, callback)
}
exports.login = (credentials, callback) => {
    accountRepository.getPasswordFromAccountByUsername(
        credentials.username,
        (error, result) => {
            if (result.length === 0) error = 'Wrong credentials'
            if (!error) {
                bcrypt.compare(
                    credentials.password,
                    result[0].password,
                    (error, result) => {
                        if (result) {
                            accountRepository.getAccountByUsername(
                                credentials.username,
                                callback
                            )
                        } else {
                            callback(['Wrong credentials.'], null)
                        }
                    }
                )
            } else callback(error, null)
        }
    )
}
