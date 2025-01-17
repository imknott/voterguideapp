// routes/search.js
var express = require('express');
var router = express.Router();
const searchController = require('../controllers/searchController');

const fetchSearchHistory = async (req, res, next) => {
    req.searchHistory = [];
    try {
        const userId = req.session.user ? req.session.user.user_id : null;
        if (userId) {
            const history = await searchController.searchHistory(userId);
            req.searchHistory = history || [];
        }
        next();
    } catch (error) {
        console.error('Error in fetchSearchHistory:', error); // Log full error details
        next(error);
    }
};


// Route to display the search form
router.get('/', fetchSearchHistory, (req, res) => {
    console.log('Search History:', req.searchHistory); // Debug log
    res.render('search', { searchHistory: req.searchHistory });
});

// Route to handle the search form submission
router.get('/results', searchController.searchCandidates);

router.get('/president', searchController.getPresident);

router.get('/election', searchController.getElection);

module.exports = router;
