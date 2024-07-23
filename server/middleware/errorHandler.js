const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {
    let ip = req.socket.remoteAddress ? req.socket.remoteAddress.replace('::ffff:','') : "::";
    logEvents(`${ip}\t${req.method}\t${req.headers.origin || ''}\t${req.headers.host || ''}\t${req.url} ${err.name}: ${err.message}`, 'errLog.log');
    // console.error(err.stack)
    res.status(500).send(err.message);
}

module.exports = errorHandler;