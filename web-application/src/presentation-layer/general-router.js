const express = require('express')
const router = express.Router()

router.get('/', (request, response) => {
    response.render('landing.hbs', { layout: 'landing.hbs' })
})
router.get('/gohome', (request, response) => {
    response.redirect('/')
})
router.get('/about', (request, response) => {
    response.render('about.hbs')
})
router.get('/login', (request, response) => {
    if (request.session.isLoggedIn) response.redirect('/posts')
    else response.render('login.hbs', { layout: 'noappbar.hbs' })
})
router.get('/register', (request, response) => {
    response.render('register.hbs', { layout: 'noappbar.hbs' })
})
router.get('/logout', (request, response) => {
    request.session.isLoggedIn = false
    request.session.user = null
    response.redirect('/')
})
router.get('*', (request, response) => {
    response.render('404.hbs')
})

module.exports = router
