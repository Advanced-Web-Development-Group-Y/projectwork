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
        } catch (error) {
            //error
        }
        next()
    })
    router.use(function(request, response, next) {
        response.setHeader('Access-Control-Allow-Origin', '*')
        response.setHeader('Access-Control-Allow-Methods', '*')
        response.setHeader('Access-Control-Allow-Headers', '*')
        response.setHeader('Access-Control-Expose-Headers', '*')
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
            response.status(403).json({ error: 'Invalid token' })
        }
        const post = {
            posterid: request.payload.userid,
            title: request.body.title,
            content: request.body.content,
            platform: request.body.platform,
            currency: request.body.currency,
            price: request.body.price
        }
        postManager.addPost(post, error => {
            if (error) {
                console.log(error)
                response.status(500).send({ error })
            } else {
                response.status(200).send({ id: post.id })
            }
        })
    })

    router.put('/post/update/:id', (request, response) => {
        if (!request.payload) {
            response.status(403).json({ error: 'Invalid token' })
        }
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
    router.post('/tokens', (request, response) => {
        const grant_type = request.body.grant_type
        const credentials = {
            username: request.body.username,
            password: request.body.password
        }
        if (grant_type != 'password') {
            response.status(400).json({ error: 'unsupported_grant_type' })
            return
        }
        accountManager.login(credentials, (error, user) => {
            if (error) {
                response.status(400).send({ error: 'invalid_grant' })
            } else {
                jwt.sign(
                    { userid: user[0].id },
                    private_key,
                    (error, token) => {
                        if (error) response.status(500).send({ error })
                        else {
                            const idToken = jwt.sign(
                                {
                                    userid: user[0].id,
                                    email: user[0].email,
                                    permission: user[0].permission_level
                                },
                                private_key
                            )
                            response.status(200).send({
                                access_token: token,
                                id_token: idToken
                            })
                        }
                    }
                )
            }
        })
    })

    router.post('/register', (request, response) => {
        const userdata = {
            username: request.body.username,
            password: request.body.password,
            confirmpassword: request.body.confirmpassword,
            firstname: request.body.firstname,
            lastname: request.body.lastname,
            email: request.body.email
        }
        accountManager.register(userdata, (error, id) => {
            if (error) {
                console.log(error)
                response.status(500).send({ error })
            } else {
                jwt.sign({ userid: id }, private_key, (error, access_token) => {
                    if (error) response.status(500).send({ error })
                    else response.status(200).send({ access_token })
                })
            }
        })
    })
    return router
}