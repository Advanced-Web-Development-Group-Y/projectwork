const express = require('express')
const accountsManager = require('../business_layer/accountManager')

const router = express.Router()

//All routers
router.get('/', (request, response) => {
    response.render('home.hbs')
})
router.get('/posts', (request, response) => {
    response.render('posts.hbs')
})
router.get('/post/:id', (request, response) => {
    response.render('post.hbs', { id: request.params.id })
})

router.get('/login', (request, response) => {
    response.render('login.hbs')
})
router.get('/register', (request, response) => {
    response.render('register.hbs')
})
router.get('/accounts', () => {
    accountsManager.getAllAccounts(accounts => {
        response.render('accounts.hbs', { accounts })
    })
})
router.get('*', (request, response) => {
    response.render('404.hbs')
})
module.exports = router
