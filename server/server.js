require('dotenv').config({path: `${__dirname}/.env`})
const express =  require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const http = require('http')
const cookieParser = require('cookie-parser')
const { parse } = require('url');

require('./scheduler/cronJobs')

const corsOptions = require('./config/corsOptions');
const { logger, logEvents } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');

const PORT = process.env.PORT || 8011

app.use(logger);

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, '/public')))

// routes
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use('/update_reports', require('./routes/api/update_report'));
app.use(verifyJWT);
app.use('/commission', require('./routes/api/commission'));
app.use('/team', require('./routes/api/team'));
app.use('/production', require('./routes/api/production'));
app.use('/user', require('./routes/api/user'));

app.get('/test', async (req, res) => {
    console.log('aaaa')
    res.json({ test: true })
})


app.all('*', (req, res) => {
    let ip = req.socket.remoteAddress ? req.socket.remoteAddress.replace('::ffff:','') : "::";
    logEvents(`${ip}\t${req.method}\t${req.headers.origin || ''}\t${req.headers.host || ''}\t${req.url} error: 404 Not Found`, 'errLog.log');

    res.status(404)
    res.json({ error: '404 Not Found'})
})

app.use(errorHandler);

const httpServer =  http.createServer(app)


httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))