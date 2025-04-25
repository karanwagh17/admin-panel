const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('./middlewares/logger.middleware');
const auth = require('./middlewares/auth.middleware');
const addID = require('./middlewares/addID.middleware');

const app = express();



app.use(bodyParser.json());
app.use(logger); 
const DB_PATH = path.join(__dirname, 'db.json');

const readDB = () => {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch (err) {
        return { heroes: [] };
    }
};

const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Route
app.post('/add/hero', addID, (req, res) => {
    try {
        const db = readDB();
        db.heroes.push(req.body);
        writeDB(db);
        res.status(201).json(db.heroes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/heroes', (req, res) => {
    try {
        res.status(200).json(readDB().heroes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/update/villain/:hero_id', auth, (req, res) => {
    try {
        const { hero_id } = req.params;
        const db = readDB();
        const hero = db.heroes.find(h => h.id === parseInt(hero_id));
        
        if (!hero) return res.status(404).json({ message: "Hero not found" });
        
        hero.villains.push(req.body);
        writeDB(db);
        res.status(200).json(hero);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/delete/hero/:hero_id', auth, (req, res) => {
    try {
        const { hero_id } = req.params;
        const db = readDB();
        const index = db.heroes.findIndex(h => h.id === parseInt(hero_id));
        
        if (index === -1) return res.status(404).json({ message: "Hero not found" });
        
        db.heroes.splice(index, 1);
        writeDB(db);
        res.status(200).json(db.heroes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(8000, () => console.log(`Server running on port ${PORT}`));
module.exports = app;