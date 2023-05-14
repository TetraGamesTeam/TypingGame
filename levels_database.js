const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('lvlsdb.sqlite');

// create the levels table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    combination1 TEXT,
    combination2 TEXT,
    combination3 TEXT,
    max_errors INTEGER
  )`);
  db.run(`INSERT INTO levels (combination1, combination2, combination3, max_errors) VALUES ('fjfj', 'ffjj', 'jffj', 5)`)
});

// close the database
db.close();