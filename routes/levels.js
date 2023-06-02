const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const app = express();
const session = require('express-session');
const crypto = require('crypto');
const seckey = crypto.randomBytes(32).toString('hex');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'nj');
app.use('/static', express.static(__dirname + '/static'));

const db = new sqlite3.Database(__dirname + '/lvlsdb.sqlite');

app.use(session({
  secret: seckey,
  resave: false,
  saveUninitialized: false
}));


function requireLoggedIn(req, res, next) {
  if (!req.session.username) {
    res.redirect('/login');
  } else {
    next();
  }
}

router.get('/', requireLoggedIn, (req, res) => {
  const username = req.session.username;

  db.all('SELECT * FROM levels', [], (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    db.get('SELECT lastlevel FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      const lastlevel = row.lastlevel || 0;
      const loggedIn = !!req.session.username;

      res.render('levels.nj', { levels: rows, loggedIn, lastlevel });
      console.log("Page rendered: Levels");
    });
  });
});

router.get('/:id', requireLoggedIn, (req, res) => {
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
    const loggedIn = !!req.session.username;
    res.render('individuallevel.nj', {
      id: row.id,
      comb1: row.combination1,
      max_errors: row.max_errors,
      loggedIn
    });
    console.log("Page rendered: Individual Level");
    
    if (loggedIn && req.session.completedLevels && req.session.completedLevels.includes(parseInt(id))) {
      const currentLevelNumber = parseInt(id);
      const nextLevelNumber = currentLevelNumber + 1;
      const username = req.session.username;
    
      db.run(`UPDATE users SET lastlevel = ? WHERE username = ?`, [nextLevelNumber, username], (err) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log(`Last level for user ${username} updated to ${nextLevelNumber}`);
      });
    }    
  });
});

module.exports = router;
