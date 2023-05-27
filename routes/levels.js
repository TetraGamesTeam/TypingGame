const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(__dirname + '/lvlsdb.sqlite');

router.get('/', (req, res) => {
  db.all('SELECT * FROM levels', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('levels.nj', { levels: rows });
  });
});

module.exports = router;