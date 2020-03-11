const Sequelize = require('sequelize')
const sequelize = new Sequelize('webAppDatabase', 'root', 'elpassword123', {
    host: 'database',
    dialect: 'mysql'
})
const Account = sequelize.define('accounts', {
    email: Sequelize.TEXT,
    username: Sequelize.TEXT,
    password: Sequelize.TEXT,
    firstname: Sequelize.TEXT,
    lastname: Sequelize.TEXT,
    permission_level: Sequelize.INTEGER
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
                    callback(error, null)
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
                    callback(error, null)
                })
        },
        getAccountByUsername: (username, callback) => {
            Account.findOne({ raw: true, where: { username: username } })
                .then(account => {
                    callback(null, [account])
                })
                .catch(error => {
                    callback(error, null)
                })
        },
        updateAccount: (data, callback) => {
            Account.update(
                {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email
                },
                { where: { id: data.id } }
            )
                .then(callback(null))
                .catch(error => {
                    callback(error)
                })
        },
        deleteAccountById: (id, callback) => {
            Account.destroy({
                where: { id: id }
            })
                .then(callback(null))
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
                .then(returned => {
                    callback(null, returned.dataValues.id)
                })
                .catch(error => {
                    callback(error, null)
                })
        }
    }
}
