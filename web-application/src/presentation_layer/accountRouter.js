const express = require('express')
const accountsManager = require('../business_layer/accountManager')

const router = express.Router()

router.get('/accounts', () => {
    accountsManager.getAllAccounts(accounts => {
        response.render('accounts.hbs', { accounts })
    })
})

module.exports = router
