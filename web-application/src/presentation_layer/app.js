const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const routes = require('./routes')
const path = require('path')
const redis = require('redis')
const session = require('express-session')
const bodyParser = require('body-parser')

let RedisStore = require('connect-redis')(session)

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
app.engine(
    'hbs',
    expressHandlebars({
        defaultLayout: 'main.hbs'
    })
)
app.use((request, response, next) => {
    response.locals.isLoggedIn = request.session.isLoggedIn
    next()
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', routes)
app.set('views', 'src/presentation_layer/views')

app.listen(8080, () => {
    console.log('Web application listening on port 8080.')
})
