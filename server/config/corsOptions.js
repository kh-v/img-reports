const fs = require('fs')
const DIR = `${__dirname}/../../storage/models/corsAllowed.json`;

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = JSON.parse(fs.readFileSync(DIR).toString())
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true
}

module.exports = corsOptions;