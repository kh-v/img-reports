const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const DIR = `${__dirname}/../../storage/logs/`;

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(DIR, 'server'))) {
            await fsPromises.mkdir(path.join(DIR, 'server'));
        }
        await fsPromises.appendFile(path.join(DIR, 'server', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

const logger = (req, res, next) => {
    let ip = req.socket.remoteAddress ? req.socket.remoteAddress.replace('::ffff:','') : "::";
    logEvents(`${ip}\t${req.method}\t${req.headers.origin || ''}\t${req.headers.host || ''}\t${req.url}`, 'reqLog.log');
    next();
}

module.exports = { logger, logEvents };
