const express = require('express')

module.exports = ({ postManager }) => {
    const router = express.Router()
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
                    isLoggedIn: request.session.isLoggedIn,
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
                postManager.checkIfUsersPost(postid, (error, posterid) => {
                    if (error) {
                        const model = {
                            somethingWentWrong: true
                        }
                        response.render('post.hbs', model)
                    } else {
                        let canEditPost =
                            posterid[0].posterid ===
                            request.session.user[0].userid
                                ? true
                                : false

                        if (request.session.user[0].permission_level === 1) {
                            canEditPost = true
                        }

                        const model = {
                            somethingWentWrong: false,
                            canUserEditPost: canEditPost,
                            post
                        }
                        response.render('post.hbs', model)
                    }
                })
            }
        })
    })
    router.get('/profile', (request, response) => {
        postManager.getAllPostsByUser(
            request.session.user[0].userid,
            (error, posts) => {
                if (error) {
                } else {
                    response.render('profile.hbs', {
                        user: request.session.user,
                        posts
                    })
                }
            }
        )
    })
    router.get('/post/update/:id', (request, response) => {
        postManager.getPost(request.params.id, (error, fetchedPost) => {
            if (error) {
                response.redirect('/posts')
            } else {
                const post = {
                    postid: fetchedPost[0].postid,
                    title: fetchedPost[0].title,
                    content: fetchedPost[0].content
                }
                response.render('updatepost.hbs', { post })
            }
        })
    })

    router.get('/post/delete/:id', (request, response) => {
        postManager.deletePostById(request.params.id, error => {
            if (error) {
                response.redirect('/posts')
            } else {
                response.redirect('/posts')
            }
        })
    })
    router.post('/post/new', (request, response) => {
        var post = {
            posterid: request.session.user[0].userid,
            title: request.body.title,
            description: request.body.descriptionInput,
            platform: request.body.platformInput
        }

        postManager.addPost(post, error => {
            if (error) {
                response.render('addnew.hbs', { error, post })
            } else {
                response.redirect('/posts')
            }
        })
    })

    router.post('/post/update/:id', (request, response) => {
        const post = {
            title: request.body.titleInput,
            content: request.body.descriptionInput,
            postid: request.params.id
        }
        postManager.updatePost(post, error => {
            if (error) {
                response.render('updatepost.hbs', { error, post })
            } else {
                response.redirect('/post/' + request.params.id)
            }
        })
    })
    return router
}
