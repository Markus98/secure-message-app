const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Check if database file exists
const dbPath = './data/secureMessage.db';
let databaseExists = fs.existsSync(dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    // If database file did not exist, init with schema
    if (!databaseExists) {
        console.log("No database file found, initializing with base schema.");
        const createSchemaQuery= fs.readFileSync('./data/sqlschema.sql').toString();
        db.run(createSchemaQuery, err => { if (err) console.log(err) });
    }
});

let urlGenerator = require("../helpers/urlGenerator");

//could be also given from the frontend
const urlLength = 30;

//get all data from sql and dislay in json format
router.get('/', async (req, res) => {
    db.all('SELECT * FROM messages', (err, rows) => {
        if (err) {
            res.json({err});
        }
        //returns all rows
        res.json(rows);
    });
});

//post a single message (the url wont be needed in the future, should be randomly generated either here or frontend)
router.post('/', async (req, res) => {
    const url = urlGenerator(urlLength);
    let password = req.body.password;
    //should catch errors
    if (!password) {
        password = null;
    }
    db.run('INSERT INTO messages(url, message, password) VALUES ( ? , ? , ? )', [url, req.body.message, req.body.password], function(err) {
        if (err) {
            res.json({err});
        }
    });
    //returns the url to frontend
    res.json(url);
    });

//get a single page based on its url
router.get('/:url', async (req, res) => {
    let getUrlSQL = 'SELECT * FROM messages WHERE url = ?';
    //get url from request
    const url = req.params.url;
    db.get(getUrlSQL, [url], (err, row) => {
        if (err) {
            res.json({err});
        }
        res.json(row);
    });
})

router.delete("/:url", async (req, res) => {
    const url = req.params.url;
    let deleteUrlSQL = 'DELETE FROM messages WHERE url = ?';
    db.run(deleteUrlSQL, url, function(err) {
        if (err) {
            res.json({err});
        }
    res.json('Postman did magic, now deleted from SQL');
    });
})

module.exports = router;