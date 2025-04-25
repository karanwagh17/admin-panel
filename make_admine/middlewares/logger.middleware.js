const fs = require('fs');
const path = require('path');

const logger = (req, res, next) => {
    const logEntry = `URL: ${req.url}, Method: ${req.method}, Timestamp: ${new Date().toString()}\n`;
    fs.appendFileSync(path.join(__dirname, '../logs.txt'), logEntry);
    console.log(logEntry.trim()); 
    next();
};
module.exports = logger;