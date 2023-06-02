const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const nunjucks = require('nunjucks');


const session = require('express-session');
const crypto = require('crypto');
const seckey = crypto.randomBytes(32).toString('hex');

app.use(session({
  secret: seckey,
  resave: false,
  saveUninitialized: false
}));

nunjucks.configure(__dirname + '/views', {
  autoescape: true,
  express: app
});

app.set('view engine', 'njk');

const indexRouter = require('./routes/index');
const levelsRouter = require('./routes/levels');
const regRouter = require('./routes/registration')
const logRouter = require('./routes/login')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/levels', levelsRouter);
app.use('/registration', regRouter)
app.use('/login', logRouter)

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;