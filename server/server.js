require('dotenv').config({path: `${__dirname}/.env`})
const express =  require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const http = require('http')
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 8011

console.log(process.env.PORT)

app.use(express.urlencoded({ extended: false }))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, '/public')))

app.get('/test', async (req, res) => {
    console.log('aaaa')
    res.json({ test: true })
})


app.all('*', (req, res) => {
    console.log(req.url)
    res.status(404)
    res.json({ error: '404 Not Found'})
})

const httpServer =  http.createServer(app)


httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))