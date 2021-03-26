const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { encryptMsg, decryptMsg, hashSHA256, hashPassword } = require('../helpers/cryptoHelper');

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

//post a single message
const insertMessageQuery = 'INSERT INTO messages(url_hash, message_cipher, password_hash, salt, timestamp, lifetime, read_limit, init_vector) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
router.post('/', async (req, res) => {
    const password = req.body.password;
    const message = req.body.message;
    const lifetime = req.body.lifetime;
    const readLimit = req.body.readLimit;
    const generatedUrl = urlGenerator(urlLength);
    const timestamp = new Date().getTime()

    // if the request has no message, reject it
    if (!message) {
        res.sendStatus(400);
        return
    }

    const urlHash = hashSHA256(generatedUrl);
    // encrypt message with the password or url hash
    const cipherObj = 
        password ? encryptMsg(password, message) : encryptMsg(urlHash, message);
    const passwordHash = password ? hashPassword(password) : null


    db.run(insertMessageQuery, [
        urlHash,
        cipherObj.hash.content,
        passwordHash,
        cipherObj.salt,
        timestamp,
        lifetime,
        readLimit,
        cipherObj.hash.iv
    ], (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return
        }
    });
    //returns the url to frontend
    res.json(generatedUrl);
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