const express = require('express');
const sqlite3 = require('sqlite3');
const router = express.Router();

const db = new sqlite3.Database(__dirname + '/lvlsdb.sqlite');

router.get('/', (req, res) => {
  res.render('login.nj');
  console.log("\x1b[34m\x1b[1m" + `Page login.nj requested` + "\x1b[0m");
});

router.post('/', (req, res) => {
  const { username, password } = req.body;
  console.log("\x1b[33m\x1b[1m" + `Server returned with username, password: ${username}, ${password}` + "\x1b[0m");
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
    console.log("\x1b[35m\x1b[1m" + `User ${username} has logged in` + "\x1b[0m");
    console.log("\x1b[34m\x1b[1m" + `Redirecting to /levels` + "\x1b[0m");
  });
});

module.exports = router;