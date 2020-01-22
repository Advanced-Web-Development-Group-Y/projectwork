const accountRepository = require('../database_layer/humanRepository')

exports.getAllAccounts = callback => {
    // authorization here
    accountRepository.getAllAccounts(accounts => {
        callback(accounts)
    })
}
