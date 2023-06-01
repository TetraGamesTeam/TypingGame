const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const db = new sqlite3.Database('./database.db');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('registration.nj');
  });

router.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.run(`INSERT INTO users (username, password, lastlevel) VALUES (?, ?, ?)`, [username, password, 1], function(err) {
    if (err) {
      console.log(err.message);
      res.sendStatus(500);
    } else {
      req.session.username = username;
      res.redirect('/levels');
    }
  });
});

module.exports = router;
