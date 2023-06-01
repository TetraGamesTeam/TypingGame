const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('lvlsdb.sqlite');

// create the levels table
db.serialize(() => {
  db.run(`CREATE TABLE levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    combination1 TEXT,
    max_errors INTEGER
  )`);
  db.run(`INSERT INTO levels (combination1, max_errors) VALUES ('fjfj jfjf fjjf jffj fjjj jfff jjfjf fjjfjf fjj jf fjjfj fjjjfjf jjf j ffj jf', 5)`);
  db.run(`INSERT INTO levels (combination1, max_errors) VALUES ('dkdk kdkd dkkd kddk kdd dkkdk kddk kkkddkd kdk k dd dk dkkd kkddk kddkkdd kdkddk kdk k', 5)`);
  db.run(`INSERT INTO levels (combination1, max_errors) VALUES ('dk jd fk jk dj kf kd kd jf jf dj kf kj jd fj kf jd jf kf dj jf kf dj kd fj kj dj fj', 5)`);
});

// close the database
db.close();