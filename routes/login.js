const express = require('express');
const sqlite3 = require('sqlite3');
const router = express.Router();

const db = new sqlite3.Database(__dirname + '/lvlsdb.sqlite');

router.get('/', (req, res) => {
  res.render('login.nj');
});

router.post('/', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
    if (!row) {
      res.render('login.nj', { error: { message: 'Incorrect username or password' } });
      return;
    }
    req.session.username = username;
    res.redirect('/levels');
  });
});

module.exports = router;