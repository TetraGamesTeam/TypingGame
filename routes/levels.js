const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const app = express();
const session = require('express-session');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'nj');
app.use('/static', express.static(__dirname + '/static'));

const db = new sqlite3.Database(__dirname + '/lvlsdb.sqlite');

app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: true
}));


app.get('/', requireLoggedIn, (req, res) => {
  db.all('SELECT * FROM levels', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('levels.nj', { levels: rows });
  });
});

app.get('/:id', requireLoggedIn, (req, res) => {
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
      max_errors: row.max_errors
    });
  });
});

function requireLoggedIn(req, res, next) {
  if (!req.session.username) {
    res.redirect('/registration');
  } else {
    next();
  }
}

app.get('/', (req, res) => {
  res.render('levels.nj');
});

app.get('/registration', (req, res) => {
  res.render('registration.nj');
});


app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.get(`SELECT id, username FROM users WHERE username=? AND password=?`, [username, password], (err, row) => {
    if (err) {
      console.log(err.message);
      res.sendStatus(500);
    } else if (!row) {
      res.sendStatus(401);
    } else {
      req.session.username = username;
      res.redirect('/');
    }
  });
});

app.post('/registration', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.run(`INSERT INTO users (username, password, lastlevel) VALUES (?, ?, ?)`, [username, password, 1], function (err) {
    if (err) {
      console.log(err.message);
      res.sendStatus(500);
    } else {
      req.session.username = username;
      res.redirect('/');
    }
  });
});


router.get('/', requireLoggedIn, (req, res) => {
  db.all('SELECT * FROM levels', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('levels.nj', { levels: rows });
  });
});

module.exports = router;
