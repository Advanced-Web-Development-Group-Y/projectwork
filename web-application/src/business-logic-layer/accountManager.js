const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = ({ accountRepository }) => {
    return {
        register: (credentials, callback) => {
            if (
                !(
                    credentials.password &&
                    credentials.firstname &&
                    credentials.lastname &&
                    credentials.email &&
                    credentials.username
                )
            )
                callback('Please fill in all inputs', null)
            else if (credentials.password !== credentials.confirmpassword)
                callback('Passwords dont match', null)
            else if (credentials.firstname.length === 0)
                callback('Firstname is to short', null)
            else if (credentials.lastname.length === 0)
                callback('Lastname is to short', null)
            else if (credentials.email.length === 0)
                callback('Email is to short', null)
            else if (credentials.password < 6)
                callback('Password is to short', null)
            else {
                bcrypt.genSalt(saltRounds, (error, salt) => {
                    bcrypt.hash(credentials.password, salt, (error, hash) => {
                        if (error) {
                            callback('Could not encrypt password', null)
                        } else {
                            credentials.password = hash
                            accountRepository.register(
                                credentials,
                                (error, id) => {
                                    if (error)
                                        callback('Account already exist', null)
                                    else callback(null, id)
                                }
                            )
                        }
                    })
                })
            }
        },
        getAccountById: (id, callback) => {
            accountRepository.getAccountById(id, (error, account) => {
                if (account !== null) {
                    callback(null, account)
                } else {
                    callback('User not found', null)
                }
            })
        },
        updateAccount: (data, callback) => {
            accountRepository.getAccountById(data.id, (error, account) => {
                if (error) {
                    callback(error, null)
                } else if (data.userid !== account[0].id) {
                    callback('Not authorized')
                } else {
                    if (data.firstname.length < 1)
                        callback('Firstname must be atleast 1 character long')
                    else if (data.lastname.length < 1)
                        callback('Lastname must be atleast 1 character long')
                    else if (data.email.length < 10)
                        callback('Email must be atleast 1 character long')
                    else {
                        accountRepository.updateAccount(data, callback)
                    }
                }
            })
        },
        deleteAccountById: (data, callback) => {
            accountRepository.getAccountById(data.id, (error, account) => {
                if (error) {
                    callback(error, null)
                } else if (data.userid !== account[0].id) {
                    callback('Not authorized')
                } else {
                    if (data.id <= -1) {
                        callback('Not a valid ID!')
                    } else {
                        accountRepository.deleteAccountById(data.id, callback)
                    }
                }
            })
        },
        login: (credentials, callback) => {
            if (!credentials.password || !credentials.username) {
                callback('Provide credentials', null)
                return
            }
            accountRepository.getPasswordFromAccountByUsername(
                credentials.username,
                (error, result) => {
                    if (
                        result === undefined ||
                        result === null ||
                        result.length === 0
                    )
                        error = 'Wrong credentials'
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
                                    callback('Wrong credentials', null)
                                }
                            }
                        )
                    } else callback(error, null)
                }
            )
        }
    }
}
