const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { encryptMsg, decryptMsg, hashSHA256, hashPassword } = require('../helpers/cryptoHelper');
const urlGenerator = require("../helpers/urlGenerator");

//could be also given from the frontend
const urlLength = 30;
const dbPath = './data/secureMessage.db';

// Check if database file exists
const databaseExists = fs.existsSync(dbPath);

// Open database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) throw (err);
    // If database file did not exist, init with schema
    if (!databaseExists) {
        console.log("No database file found, initializing with base schema.");
        const createSchemaQuery= fs.readFileSync('./data/sqlschema.sql').toString();
        db.run(createSchemaQuery, err => { if (err) console.log(err) });
    }
});

// POST a single message
const insertMessageQuery = 'INSERT INTO messages(url_hash, password_protected, message_cipher, password_hash, salt, timestamp, lifetime, read_limit, init_vector) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);';
router.post('/', async (req, res) => {
    const password = req.body.password;
    const message = req.body.message;
    const lifetime = req.body.lifetime;
    const readLimit = req.body.readLimit;
    const generatedUrl = urlGenerator(urlLength);
    const timestamp = new Date().getTime()

    // if the request has no message, reject it
    if (!message) {
        return res.sendStatus(400);
    }

    const urlHash = hashSHA256(generatedUrl);
    // encrypt message with the password or url hash
    const cipherObj = 
        password ? encryptMsg(password, message) : encryptMsg(urlHash, message);

    db.run(insertMessageQuery, [
        urlHash,
        password !== undefined, // has password or not
        cipherObj.hash.content,
        cipherObj.key,
        cipherObj.salt,
        timestamp,
        lifetime,
        readLimit,
        cipherObj.hash.iv
    ], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    });
    //returns the url to frontend
    res.json({
        generatedUrl
    });
});

// GET a specific message
const getMessageQuery = 'SELECT * FROM messages WHERE url_hash = ?;';
const incrementReadNumberQuery = 'UPDATE messages SET times_read = times_read + 1 WHERE url_hash = ?;';
const deleteMessageQuery = 'DELETE FROM messages WHERE url_hash = ?;';
router.post('/:url', async (req, res) => {
    const url = req.params.url;
    const password = req.body.password;

    const urlHash = hashSHA256(url);

    db.get(getMessageQuery, [urlHash], (err, row) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        // If url does not exist
        if (row === undefined) {
            return res.sendStatus(404);
        }

        const timeAlive = new Date().getTime() - row.timestamp;
        const aliveTimeLeft = row.lifetime ? row.lifetime - timeAlive : null;

        const responseObj = {
            "timestamp": row.timestamp,
            "lifetime": row.lifetime,
            "aliveTimeLeft": aliveTimeLeft,
            "timesRead": row.times_read + 1,
            "readLimit": row.read_limit
        };

        const hashObj = {
            iv: row.init_vector,
            content: row.message_cipher
        }

        // check if the message requires a password
        if (row.password_protected) {
            // Send unauthorized if no password provided
            if (!password) {
                return res.sendStatus(401);
            }

            // Check if correct password 
            // TODO: limit number of attempts
            const receivedPasswordHash = hashPassword(password, row.salt);
            if (receivedPasswordHash.toString() !== row.password_hash.toString()) {
                return res.sendStatus(403);
            }

            responseObj["message"] = decryptMsg(password, row.salt, hashObj);
        } else {

            responseObj["message"] = decryptMsg(urlHash, row.salt, hashObj);
        }

        // Increment read number and send reponse
        db.run(incrementReadNumberQuery, [urlHash], (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            } else {
                const readLimitReached = row.read_limit && responseObj.timesRead >= row.read_limit;
                const lifeLimitReached = row.lifetime && timeAlive > row.lifetime;
                // Delete row if read read limit reached or past lifetime
                if (lifeLimitReached) {
                    db.run(deleteMessageQuery, [urlHash], (err) => {
                        if (err) console.log(err);
                        return res.sendStatus(404);
                    });
                } else if (readLimitReached) {
                    db.run(deleteMessageQuery, [urlHash], (err) => {
                        if (err) console.log(err);
                        return res.json(responseObj);
                    });
                } else {
                    return res.json(responseObj);
                }
            }
        });
    });
});


router.delete("/:url", async (req, res) => {
    const url = req.params.url;

    res.sendStatus(501); // Not yet implemented
    // db.run(deleteMessageQuery, url, function(err) {
    //     if (err) {
    //     }
    // res.json('Postman did magic, now deleted from SQL');
    // });
});

module.exports = router;