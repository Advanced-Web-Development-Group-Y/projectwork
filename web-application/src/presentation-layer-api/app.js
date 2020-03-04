/*Requires*/
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const awilix = require('awilix')

/*Middlewares*/

app.use(bodyParser.json())

/* Create container */
const container = awilix.createContainer()

/*Account dependency*/
const accountRepository = require('../data-access-layer-MySQL/accountRepository')
const accountManager = require('../business-logic-layer/accountManager')
const accountRouter = require('../presentation-layer-api/account-router')

container.register('accountRepository', awilix.asFunction(accountRepository))
container.register('accountManager', awilix.asFunction(accountManager))
container.register('accountRouter', awilix.asFunction(accountRouter))

const theAccountRouter = container.resolve('accountRouter')

/*Post dependency*/
const postRepository = require('../data-access-layer-MySQL/postRepository')
const postManager = require('../business-logic-layer/postManager')
const postRouter = require('../presentation-layer-api/post-router')

container.register('postRepository', awilix.asFunction(postRepository))
container.register('postManager', awilix.asFunction(postManager))
container.register('postRouter', awilix.asFunction(postRouter))

const thePostRouter = container.resolve('postRouter')
app.use(theAccountRouter)
app.use(thePostRouter)

app.listen(3000, () => {
    console.log('REST API listening on port 3000.')
})
