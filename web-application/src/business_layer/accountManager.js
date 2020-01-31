const accountRepository = require('../dataaccess_layer/accountRepository')

exports.getAllAccounts = callback => {
    // authorization here, only admins should be able to get all accounts
    accountRepository.getAllAccounts(accounts => {
        callback(accounts)
    })
}
