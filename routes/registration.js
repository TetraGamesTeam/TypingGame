const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const db = new sqlite3.Database(__dirname + '/lvlsdb.sqlite');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('registration.nj');
    console.log("\x1b[34m\x1b[1m" + `Page registration.nj requested` + "\x1b[0m");
});

router.post('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("\x1b[33m\x1b[1m" + `Server returned with username, password: ${username}, ${password}` + "\x1b[0m");

    db.run(`INSERT INTO users (username, password, lastlevel) VALUES (?, ?, ?)`, [username, password, 1], function (err) {
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
        } else {
            req.session.username = username;
            console.log("\x1b[35m\x1b[1m" + `User ${username} with password ${password} just created a new account.` + "\x1b[0m");
            res.redirect('/levels');
            console.log("\x1b[34m\x1b[1m" + `Redirecting to /levels` + "\x1b[0m");
        }
    });
});

module.exports = router;
