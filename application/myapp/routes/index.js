var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index'); // 'index' refers to index.pug in the 'views' directory
});

module.exports = router;