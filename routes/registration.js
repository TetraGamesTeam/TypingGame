const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const db = new sqlite3.Database(__dirname + '/lvlsdb.sqlite');
const router = express.Router();

router.get('/', (req, res) => {
    console.log("Page loading: Registration")
    res.render('registration.nj');
});

router.post('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("Server returned with username, password: " + username + ", " + password)

    db.run(`INSERT INTO users (username, password, lastlevel) VALUES (?, ?, ?)`, [username, password, 1], function (err) {
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
        } else {
            req.session.username = username;
            console.log('User ' + username + ' with password ' + password + 'just created a new account')
            res.redirect('/levels');
        }
    });
});

module.exports = router;
