const express = require('express')
const accountManager = require('../business_layer/accountManager')
const postManager = require('../business_layer/postManager')

const router = express.Router()

//All routers
router.get('/', (request, response) => {
    response.render('landing.hbs', { layout: 'landing.hbs' })
})
router.get('/posts', (request, response) => {
    postManager.getAllPosts((error, posts) => {
        if (error) {
            const model = {
                somethingWentWrong: true
            }
            response.render('posts.hbs', model)
        } else {
            const model = {
                somethingWentWrong: false,
                posts
            }
            response.render('posts.hbs', model)
        }
    })
})
router.get('/post/new', (request, response) => {
    response.render('addnew.hbs')
})
router.get('/post/:id', (request, response) => {
    postManager.getPost(request.params.id, (error, post) => {
        if (error) {
            const model = {
                somethingWentWrong: true
            }
            response.render('post.hbs', model)
        } else {
            const model = {
                somethingWentWrong: false,
                post
            }
            response.render('post.hbs', model)
        }
    })
})

router.get('/login', (request, response) => {
    response.render('login.hbs')
})
router.get('/register', (request, response) => {
    response.render('register.hbs')
})
router.get('/accounts', () => {
    accountManager.getAllAccounts(accounts => {
        response.render('accounts.hbs', { accounts })
    })
})
router.get('/profile', (request, response) => {
    response.render('profile.hbs')
})
router.get('/about', (request, response) => {
    response.render('about.hbs')
})
router.get('*', (request, response) => {
    response.render('404.hbs')
})
module.exports = router
