const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const routes = require('./routes')
app.set('views', 'src/presentation_layer/views')
app.use('/', routes)

app.engine(
    'hbs',
    expressHandlebars({
        defaultLayout: 'main.hbs'
    })
)

app.listen(8080, () => {
    console.log('Web application listening on port 8080.')
})
