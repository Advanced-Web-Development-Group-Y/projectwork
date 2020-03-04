const express = require('express')
const jwt = require('jsonwebtoken')
const private_key = 'theratcatmatsatu'

module.exports = ({ postManager }) => {
    // TODO: FIX ERROR CODES
    const router = express.Router()

    router.get('/posts', (request, response) => {
        postManager.getAllPosts((error, posts) => {
            if (error) {
                response.status(500).send({ error })
            } else {
                response.status(200).send({ posts })
            }
        })
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
                response.status(500).send({ error })
            } else {
                response.status(200).send({ post })
            }
        })
    })
    router.post('/post/new', (request, response) => {
        //needs idtoken implementation
        if (!request.headers.authorization) {
            response.status(403).json({ error: 'No credentials sent' })
        }
        var userId
        jwt.verify(
            request.headers.authorization.split(' ')[1],
            private_key,
            (error, decoded) => {
                if (error) {
                    response.status(401).send({ error })
                } else {
                    userId = decoded.id
                }
            }
        )
        var post = {
            posterid: userId,
            title: request.body.title,
            content: request.body.content,
            platform: request.body.platform
        }

        postManager.addPost(post, error => {
            if (error) {
                response.status(500).send({ error })
            } else {
                response.status(200).send({ status: 'Created' })
            }
        })
    })

    router.put('/post/update/:id', (request, response) => {
        const post = {
            title: request.body.title,
            content: request.body.content,
            postid: request.params.id
        }
        postManager.updatePost(post, error => {
            if (error) {
                response.status(500).send({ error })
            } else {
                response.status(200).send({ status: 'Updated' })
            }
        })
    })
    return router
}
