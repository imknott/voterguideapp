const pollingController = require('../controllers/pollingController');
var express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
    res.render('pollinglocations'); 
  });


module.exports = router;