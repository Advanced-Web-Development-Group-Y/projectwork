/*Requires*/
const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const routes = require('./general-router')
const path = require('path')
const redis = require('redis')
const session = require('express-session')
const bodyParser = require('body-parser')
const awilix = require('awilix')
const RedisStore = require('connect-redis')(session)

/*Redis setup*/
let redisClient = redis.createClient({
    host: 'redis',
    password: 'elpassword123',
    db: 1
})
redisClient.unref()
redisClient.on('error', console.log)
let store = new RedisStore({ client: redisClient })
app.use(
    session({
        store,
        resave: false,
        saveUninitialized: false,
        secret: 'elpassword123'
    })
)

/*App engine */
app.engine(
    'hbs',
    expressHandlebars({
        defaultLayout: 'main.hbs'
    })
)

/*Middlewares*/
app.use((request, response, next) => {
    response.locals.isLoggedIn = request.session.isLoggedIn
    next()
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', 'src/presentation-layer/views')

/* Dependency injection */

/* Create container */
const container = awilix.createContainer()

/*Account dependency*/
const accountRepository = require('../data-access-layer/accountRepository')
const accountManager = require('../business-logic-layer/accountManager')
const accountRouter = require('../presentation-layer/account-router')

container.register('accountRepository', awilix.asFunction(accountRepository))
container.register('accountManager', awilix.asFunction(accountManager))
container.register('accountRouter', awilix.asFunction(accountRouter))

const theAccountRouter = container.resolve('accountRouter')

/*Post dependency*/
const postRepository = require('../data-access-layer/postRepository')
const postManager = require('../business-logic-layer/postManager')
const postRouter = require('../presentation-layer/post-router')

container.register('postRepository', awilix.asFunction(postRepository))
container.register('postManager', awilix.asFunction(postManager))
container.register('postRouter', awilix.asFunction(postRouter))

const thePostRouter = container.resolve('postRouter')
app.use(theAccountRouter)
app.use(thePostRouter)
app.use('/', routes)

app.listen(8080, () => {
    console.log('Web application listening on port 8080.')
})
