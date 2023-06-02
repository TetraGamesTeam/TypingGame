const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/index.html'))
  console.log("\x1b[34m\x1b[1m" + `Page index.html requested` + "\x1b[0m");
});

module.exports = router;
