const express = require('express')
module.exports = ({ commentManager }) => {
    const router = express.Router()
    const redirectIfNotLoggedIn = (request, response, next) => {
        if (!request.session.user) {
            response.redirect('/login')
        } else return next()
    }
    router.get(
        '/comment/update/:id',
        redirectIfNotLoggedIn,
        (request, response) => {
            commentManager.getCommentById(
                request.params.id,
                (error, fetchedComment) => {
                    if (error) {
                        response.redirect('/posts')
                    } else {
                        const comment = {
                            id: fetchedComment[0].id,
                            content: fetchedComment[0].content,
                            postid: fetchedComment[0].postid
                        }
                        response.render('updatecomment.hbs', { comment })
                    }
                }
            )
        }
    )
    router.post(
        '/comment/add/:postid',
        redirectIfNotLoggedIn,
        (request, response) => {
            var comment = {
                posterid: request.session.user[0].id,
                posterusername: request.session.user[0].username,
                postid: parseInt(request.params.postid),
                content: request.body.content
            }
            commentManager.addComment(comment, error => {
                if (error) {
                    console.log(error)
                    response.redirect('/post/' + request.params.postid)
                } else {
                    response.redirect('/post/' + request.params.postid)
                }
            })
        }
    )
    router.post(
        '/comment/delete/:id',
        redirectIfNotLoggedIn,
        (request, response) => {
            const information = {
                id: request.params.id,
                userid: request.session.user[0].id,
                isAdmin: request.session.user[0].permission_level === 1
            }
            commentManager.deleteCommentById(information, error => {
                if (error) console.log(error)
                response.redirect('/post/' + request.body.postid)
            })
        }
    )
    router.post(
        '/comment/update/:id',
        redirectIfNotLoggedIn,
        (request, response) => {
            const information = {
                id: request.params.id,
                content: request.body.content,
                postid: request.body.postid,
                userid: request.session.user[0].id,
                isAdmin: request.session.user[0].permission_level === 1
            }
            commentManager.updateComment(information, error => {
                if (error) {
                    response.render('updatecomment.hbs', { error, information })
                } else {
                    response.redirect('/post/' + information.postid)
                }
            })
        }
    )

    return router
}
