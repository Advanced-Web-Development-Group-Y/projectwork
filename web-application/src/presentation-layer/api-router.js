const express = require('express')
const jwt = require('jsonwebtoken')
const private_key = 'theratcatmatsatu'

module.exports = ({ postManager, accountManager }) => {
    // TODO: FIX ERROR CODES
    const router = express.Router()
    router.use((request, response, next) => {
        try {
            const authorizationHeader = request.get('Authorization')
            const accessTokenString = authorizationHeader.substr(
                'Bearer '.length
            )

            request.payload = jwt.verify(accessTokenString, private_key)
            console.log(request.payload)
        } catch (e) {
            //Access token is broken
        }
        next()
    })
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
        if (!request.payload) {
            response.status(403).json({ error: 'No accesstoken recieved' })
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
    router.get('/profile/:id', (request, response) => {
        accountManager.getAccountById(request.params.id, (error, user) => {
            if (error || user.length === 0) {
                response.status(500).send({ error })
            } else {
                accountManager.getAllPostsByUser(
                    request.params.id,
                    (error, posts) => {
                        if (error) {
                            response.status(500).send({ error })
                        } else {
                            response.status(200).send({ user, posts })
                        }
                    }
                )
            }
        })
    })
    router.post('/login', (request, response) => {
        accountManager.login(request.body, (error, user) => {
            if (error) {
                response.status(401).send({ error })
            } else {
                jwt.sign({ userid: user.id }, private_key, (error, token) => {
                    if (error) response.status(500).send({ error })
                    else response.status(200).send({ token })
                })
            }
        })
    })

    router.post('/register', (request, response) => {
        accountManager.register(request.body, (error, id) => {
            if (error) {
                response.status(500).send({ error })
            } else {
                jwt.sign({ userid: id }, private_key, (error, token) => {
                    if (error) response.status(500).send({ error })
                    else response.status(200).send({ token })
                })
            }
        })
    })
    return router
}
