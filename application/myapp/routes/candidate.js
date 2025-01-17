const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

// GET route to display candidate data and ratings
router.get("/", candidateController.getCandidateData);

// Route for setting ratings
router.post("/set-rating", candidateController.setRatings);

// Route for setting comments (updated to use io from req)
router.post("/set-comment", (req, res) => {
    candidateController.setUserComment(req, res, req.io);  // Pass io from the request object
});

//Below this comment is where we set the get and post functions for creating new data for candidates
//policies and events.
router.get("/new", candidateController.newCandidate);
router.post("/new", candidateController.createCandidate);

router.get("/newEvent", candidateController.newCandidateEvent);
router.post("/newEvent", candidateController.createCandidateEvent);

router.get("/newPolicy", candidateController.newCandidatePolicy);
router.post("/newPolicy", candidateController.createCandidatePolicy);

module.exports = router;
