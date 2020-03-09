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
                                    if (error) callback(error, null)
                                    else callback(null, id)
                                }
                            )
                        }
                    })
                })
            }
        },
        getAccountById: (id, callback) => {
            accountRepository.getAccountById(id, callback)
        },
        login: (credentials, callback) => {
            if (!credentials.password || !credentials.username) {
                callback('Provide credentials', null)
                return
            }
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
                                    callback('Wrong credentials', null)
                                }
                            }
                        )
                    } else callback(error, null)
                }
            )
        },
        getAllPostsByUser: (userid, callback) => {
            accountRepository.getAllPostsByUser(userid, (error, posts) => {
                callback(error, posts)
            })
        }
    }
}
