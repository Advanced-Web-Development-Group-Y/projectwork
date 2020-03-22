const express = require('express')

module.exports = ({ postManager, commentManager, accountManager }) => {
    const router = express.Router()

    const redirectIfNotLoggedIn = (request, response, next) => {
        if (!request.session.user) {
            response.redirect('/login')
        } else return next()
    }

    router.get('/posts', (request, response) => {
        if (request.query.keyword || request.query.platform) {
            postManager.getAllFilteredPosts(request.query, (error, posts) => {
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
        } else {
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
        }
    })

    router.get('/post/new', (request, response) => {
        response.render('addnew.hbs')
    })
    router.get('/post/:id', (request, response) => {
        const postid = request.params.id
        postManager.incrementViewCountByPostId(postid, error => {
            if (error) {
                console.log('Error raising viewcount: ', error)
            }
        })

        postManager.getPost(postid, (error, post) => {
            if (error) {
                const model = {
                    somethingWentWrong: true
                }

                response.render('post.hbs', model)
            } else {
                var canEditPost
                if (request.session.user) {
                    canEditPost =
                        post[0].posterid === request.session.user[0].id
                            ? true
                            : false
                }

                accountManager.getAccountById(
                    post[0].posterid,
                    (error, owner) => {
                        if (error) {
                            const model = {
                                somethingWentWrong: true
                            }
                            response.render('post.hbs', model)
                        } else {
                            commentManager.getPostCommentsByPostId(
                                postid,
                                (error, comments) => {
                                    if (error) {
                                        const model = {
                                            somethingWentWrong: true,
                                            canUserEditPost: canEditPost,
                                            post
                                        }
                                        response.render('post.hbs', model)
                                    } else {
                                        var canDeleteComments
                                        if (request.session.user) {
                                            if (
                                                request.session.user[0]
                                                    .permission_level === 1
                                            )
                                                canDeleteComments = true

                                            for (comment of comments) {
                                                if (
                                                    comment.posterid ===
                                                    request.session.user[0].id
                                                )
                                                    comment.isOwner = true
                                                else comment.isOwner = false
                                            }
                                        }
                                        const model = {
                                            somethingWentWrong: false,
                                            canUserEditPost: canEditPost,
                                            post,
                                            comments,
                                            owner: owner[0],
                                            canDeleteComments,
                                            isLoggedIn:
                                                request.session.isLoggedIn
                                        }
                                        response.render('post.hbs', model)
                                    }
                                }
                            )
                        }
                    }
                )
            }
        })
    })

    router.get('/post/update/:id', (request, response) => {
        postManager.getPost(request.params.id, (error, fetchedPost) => {
            if (error) {
                response.redirect('/posts')
            } else {
                const post = {
                    id: fetchedPost[0].id,
                    title: fetchedPost[0].title,
                    content: fetchedPost[0].content,
                    platform: fetchedPost[0].platform,
                    currency: fetchedPost[0].currency,
                    price: fetchedPost[0].price
                }
                response.render('updatepost.hbs', { post })
            }
        })
    })

    router.post(
        '/post/delete/:id',
        redirectIfNotLoggedIn,
        (request, response) => {
            const information = {
                id: request.params.id,
                userid: request.session.user[0].id
            }
            postManager.deletePostById(information, error => {
                if (error) {
                    console.log(error)
                    response.redirect('/post/' + request.params.id)
                } else {
                    response.redirect('/posts')
                }
            })
        }
    )
    router.post('/post/new', redirectIfNotLoggedIn, (request, response) => {
        var post = {
            userid: request.session.user[0].id,
            title: request.body.title,
            content: request.body.content,
            platform: request.body.platform,
            currency: request.body.currency,
            price: request.body.price
        }
        postManager.addPost(post, error => {
            if (error) {
                response.render('addnew.hbs', { error, post })
            } else {
                response.redirect('/posts')
            }
        })
    })

    router.post(
        '/post/update/:id',
        redirectIfNotLoggedIn,
        (request, response) => {
            const post = {
                userid: request.session.user[0].id,
                title: request.body.title,
                content: request.body.content,
                currency: request.body.currency,
                platform: request.body.platform,
                price: request.body.price,
                postid: request.params.id
            }
            postManager.updatePost(post, error => {
                if (error) {
                    response.render('updatepost.hbs', { error, post })
                } else {
                    response.redirect('/post/' + request.params.id)
                }
            })
        }
    )
    return router
}
