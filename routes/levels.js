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

const levels = [
  { answer: "привет", name: "Уровень 1" },
  { answer: "мороженое", name: "Уровень 2" },
  { answer: "крокодил", name: "Уровень 3" },
];

router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.all('SELECT * FROM levels where id = ?', [id], (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (rows.length === 0) {
      res.status(404).send('Not Found');
      return;
    }
    const row = rows[0];
    res.render('individuallevel.nj', {
      id: row.id,
      comb1: row.combination1,
      comb2: row.combination2,
      comb3: row.combination3,
      max_errors: row.max_errors
    });
  });
});

module.exports = router;