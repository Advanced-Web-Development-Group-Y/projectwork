const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()

app.set('views', 'src/views')

app.engine(
    'hbs',
    expressHandlebars({
        defaultLayout: 'main.hbs'
    })
)
app.get('/', (request, response) => {
    response.send('Hello, Worlsds')
})

app.listen(8080, () => {
    console.log('Web application listening on port 8080.')
})
