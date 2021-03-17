let router = require('express').Router()
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./data/messageApp.db');

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
    //crymessage is a bad paramater name, can be changed in sql
    const cryptedMessage = {
        'url': req.body.url,
        'crymessage': req.body.message
    };
    //did this with some string formatting
    let instertSQL = 'INSERT INTO messages(url, crymessage) VALUES ("'+cryptedMessage.url+'","'+cryptedMessage.crymessage +'")';
    //should catch errors
    db.run(instertSQL, function(err) {
        if (err) {
            res.json({err});
        }
    res.json('Postman did magic, now in SQL');
    });
});
//get a single page based on its url
router.get('/:url', async (req, res) => {
    let getUrlSQL = 'SELECT * FROM messages WHERE url = ?';
    //get url fromt request
    const url = req.params.url;
    db.get(getUrlSQL, [url], (err, row) => {
        if (err) {
            res.json({err});
        }
        res.json(row);
    });
})
module.exports = router;