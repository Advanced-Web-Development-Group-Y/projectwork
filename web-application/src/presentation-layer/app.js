/*Requires*/
const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const generalRouter = require('./general-router')
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
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((request, response, next) => {
    response.locals.isLoggedIn = request.session.isLoggedIn
    next()
})
app.use(express.static(path.join(__dirname, 'public')))

app.set('views', 'src/presentation-layer/views')

/* Dependency injection */

/* Create container */
const container = awilix.createContainer()

/*Managers*/
const accountManager = require('../business-logic-layer/accountManager')
const postManager = require('../business-logic-layer/postManager')
const commentManager = require('../business-logic-layer/commentManager')

/*Repositories*/
const postRepository = require('../data-access-layer-MySQL/postRepository')
const accountRepository = require('../data-access-layer-MySQL/accountRepository')
const commentRepository = require('../data-access-layer-MySQL/commentRepository')

/*Routers*/
const accountRouter = require('../presentation-layer/account-router')
const postRouter = require('../presentation-layer/post-router')
const apiRouter = require('../presentation-layer/api-router')
const commentRouter = require('../presentation-layer/comment-router')

/* Register */
container.register('commentRepository', awilix.asFunction(commentRepository))
container.register('commentManager', awilix.asFunction(commentManager))
container.register('commentRouter', awilix.asFunction(commentRouter))
container.register('postRepository', awilix.asFunction(postRepository))
container.register('postManager', awilix.asFunction(postManager))
container.register('postRouter', awilix.asFunction(postRouter))
container.register('accountRepository', awilix.asFunction(accountRepository))
container.register('accountManager', awilix.asFunction(accountManager))
container.register('accountRouter', awilix.asFunction(accountRouter))
container.register('apiRouter', awilix.asFunction(apiRouter))

/* Resolve */

const theCommentRouter = container.resolve('commentRouter')
const thePostRouter = container.resolve('postRouter')
const theAccountRouter = container.resolve('accountRouter')
const theApiRouter = container.resolve('apiRouter')

app.use('/api', theApiRouter)
app.use(theAccountRouter)
app.use(thePostRouter)
app.use(generalRouter)
app.use(theCommentRouter)
app.listen(8080, () => {
    console.log('Web application listening on port 8080.')
})
