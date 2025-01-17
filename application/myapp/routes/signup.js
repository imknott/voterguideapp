const express = require('express');
const router = express.Router();
const {signup,login} = require('../controllers/signupController.js');

// Serve the signup page
router.get('/signup', (req, res) => {
  res.render('signup'); // Make sure you have a signup.pug file in your views directory
});
// Handle signup requests
router.post('/signup', signup); // For signing up new users

// Handle login requests
router.post('/login', login);     // For logging in existing users

module.exports = router;