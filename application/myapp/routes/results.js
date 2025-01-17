const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

router.get('/', (req, res) => {
    res.render('results'); 
});

router.get('/candidate', candidateController.getCandidateData);

module.exports = router;
