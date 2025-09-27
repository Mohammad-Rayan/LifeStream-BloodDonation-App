const fs = require('fs');

const filePath = 'logs/requests.log';
const logRequest = async (req, res, next) => {
    const logMessage = `[${new Date().toLocaleString()}] Request to ${req.originalUrl} \n`;
    try {
        await fs.promises.appendFile(filePath, logMessage);
        console.log(logMessage);
        next();
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports = logRequest;