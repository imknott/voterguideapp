var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('about'); 
});

router.get('/brenna', (req, res, ) => {
  res.render('brenna');
});
router.get('/ian', (req, res, ) => {
  res.render('ian');
});
router.get('/adan', (req, res) => {
  res.render('adan');
});
router.get('/demetrio', (req, res) => {
  res.render('demetrio');
});
router.get('/subhan', (req, res) => {
  res.render('subhan');
});
router.get('/daniel', (req, res) => {
  res.render('daniel');
});
router.get('/leonardo', (req, res) => {
  res.render('leonardo');
});


module.exports = router;