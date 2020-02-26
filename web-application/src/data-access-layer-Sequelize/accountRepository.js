const Seqeuelize = require('sequelize')
const sequelize = new Seqeuelize('webAppDatabase', 'root', 'elpassword123', {
    host: 'database',
    dialect: 'mysql'
})
const Account = sequelize.define('accounts', {
    email: Seqeuelize.TEXT,
    username: Seqeuelize.TEXT,
    password: Seqeuelize.TEXT,
    firstname: Seqeuelize.TEXT,
    lastname: Seqeuelize.TEXT,
    permission_level: Seqeuelize.INTEGER
})
sequelize.sync()

module.exports = ({}) => {
    return {
        getAccountById: (id, callback) => {
            Account.findByPk(id, {
                attributes: { exclude: ['password'] },
                raw: true
            })
                .then(account => {
                    callback(null, [account])
                })
                .catch(error => {
                    callback(error)
                })
        },
        getPasswordFromAccountByUsername: (username, callback) => {
            Account.findOne({
                raw: true,
                where: { username: username }
            })
                .then(account => {
                    callback(null, [account])
                })
                .catch(error => {
                    callback(error)
                })
        },
        getAccountByUsername: (username, callback) => {
            Account.findOne({ raw: true, where: { username: username } })
                .then(account => {
                    callback(null, [account])
                })
                .catch(error => {
                    callback(error)
                })
        },
        register: (credentials, callback) => {
            Account.create({
                username: credentials.username,
                password: credentials.password,
                firstname: credentials.firstname,
                lastname: credentials.lastname,
                email: credentials.email
            })
                .then(callback(null))
                .catch(error => {
                    callback(error)
                })
        }
    }
}