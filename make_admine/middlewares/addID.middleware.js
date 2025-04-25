const fs = require('fs');
const path = require('path');

const addID = (req, res, next) => {
    const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf8'));
    const lastId = db.heroes.length > 0 ? Math.max(...db.heroes.map(hero=> hero.id)) : 0;
    req.body.id = lastId + 1;
    next();
};

module.exports = addID;