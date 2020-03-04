const express = require('express')
const jwt = require('jsonwebtoken')
const private_key = 'theratcatmatsatu'
module.exports = ({ accountManager }) => {
    // TODO: FIX ERROR CODES
    const router = express.Router()

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
