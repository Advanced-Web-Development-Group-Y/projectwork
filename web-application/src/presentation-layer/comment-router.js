const express = require('express')
module.exports = ({ commentManager }) => {
    const router = express.Router()
    router.post('/comment/add/:postid', (request, response) => {
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
    })

    return router
}
