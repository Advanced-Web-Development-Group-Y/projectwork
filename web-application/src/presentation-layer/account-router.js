const express = require('express')
module.exports = ({ accountManager, postManager }) => {
    const router = express.Router()
    const redirectIfNotLoggedIn = (request, response, next) => {
        if (!request.session.user) {
            response.redirect('/login')
        } else return next()
    }
    router.get('/profile', (request, response) => {
        if (request.session.user) {
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
                postManager.getAllPostsByUser(
                    request.params.id,
                    (error, posts) => {
                        if (error) {
                        } else {
                            var canEdit
                            if (request.session.user)
                                if (user[0].id === request.session.user[0].id)
                                    canEdit = true
                                else canEdit = false
                            const model = {
                                somethingWentWrong: false,
                                user,
                                posts,
                                canEdit
                            }
                            response.render('profile.hbs', model)
                        }
                    }
                )
            }
        })
    })
    router.post(
        '/profile/update/:id',
        redirectIfNotLoggedIn,
        (request, response) => {
            const information = {
                userid: request.session.user[0].id,
                id: request.params.id,
                firstname: request.body.firstname,
                lastname: request.body.lastname,
                email: request.body.email
            }
            accountManager.updateAccount(information, error => {
                if (error) {
                    response.redirect('/profile/' + request.params.id)
                } else {
                    response.redirect('/profile/' + request.params.id)
                }
            })
        }
    )

    router.post(
        '/profile/delete/:id',
        redirectIfNotLoggedIn,
        (request, response) => {
            const information = {
                userid: request.session.user[0].id,
                id: request.params.id
            }
            accountManager.deleteAccountById(information, error => {
                if (error) {
                    console.log(error)
                    response.redirect('/profile/' + request.params.id)
                } else {
                    request.session.isLoggedIn = false
                    request.session.user = null
                    response.redirect('/login')
                }
            })
        }
    )
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
