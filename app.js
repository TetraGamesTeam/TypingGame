const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');



const app = express();
const nunjucks = require('nunjucks');

app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Configure Nunjucks
nunjucks.configure(__dirname + '/views', {
  autoescape: true,
  express: app
});

app.set('view engine', 'njk');

const indexRouter = require('./routes/index');
const levelsRouter = require('./routes/levels');
const regRouter = require('./routes/registration')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/levels', levelsRouter);
app.use('/registration', regRouter)

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;