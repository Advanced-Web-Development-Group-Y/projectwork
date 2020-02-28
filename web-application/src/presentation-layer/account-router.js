const express = require('express')
module.exports = ({ accountManager }) => {
    const router = express.Router()

    router.get('/profile', (request, response) => {
        if (request.session.isLoggedIn) {
            var string = encodeURIComponent(request.session.user[0].id)
            response.redirect('/profile/' + string)
        } else {
            response.redirect('/login')
        }
    })
    router.get('/profile/:id', (request, response) => {
        accountManager.getAccountById(request.params.id, (error, user) => {
            if (error || user.length === 0) {
                const model = {
                    somethingWentWrong: true
                }
                response.render('profile.hbs', model)
            } else {
                accountManager.getAllPostsByUser(
                    request.params.id,
                    (error, posts) => {
                        if (error) {
                        } else {
                            const model = {
                                somethingWentWrong: false,
                                user,
                                posts
                            }
                            response.render('profile.hbs', model)
                        }
                    }
                )
            }
        })
    })
    router.post('/login', (request, response) => {
        accountManager.login(request.body, (error, user) => {
            if (error) {
                response.render('login.hbs', { layout: 'noappbar.hbs', error })
            } else {
                request.session.isLoggedIn = true
                request.session.user = user
                response.redirect('/posts')
            }
        })
    })

    router.post('/register', (request, response) => {
        accountManager.register(request.body, error => {
            if (error) {
                response.render('register.hbs', {
                    layout: 'noappbar.hbs',
                    error
                })
            } else {
                response.redirect('/login')
            }
        })
    })

    return router
}
