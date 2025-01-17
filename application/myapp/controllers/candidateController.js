const db = require('../config/db'); // Import sequelize connection
require('dotenv').config({ path: 'makefile.env' });
const yt = require('youtube-api-search');
const { LiveChat } = require('../models/CandidateInfo');

// Video search function using YouTube API
const videoSearch = (term) => {
    return new Promise((resolve, reject) => {
        yt({ key: process.env.YOUTUBE_API_KEY, term: term, maxResults: 1 }, (videos) => {
            if (videos) {
                resolve(videos);
            } else {
                reject("No videos found");
            }
        });
    });
};

// Fetch candidate data and render the page
exports.getCandidateData = async (req, res) => {
    const c_id = req.query.Candidate_id;
    const USER = req.session.user;

    if (!c_id) {
        return res.render('search', { error: 'Please enter a search term.' });
    }

    try {
        // Fetch candidate data
        const [results] = await db.query(
            `SELECT * FROM CandidateInfo WHERE Candidate_id=:candidate_id`, {
                replacements: { candidate_id: c_id }
            }
        );
        const resArr = Array.isArray(results) ? results : [results];

        // Fetch associated policies
        const [policies] = await db.query(
            `SELECT Policy_description FROM CandidatePolicy WHERE Candidate_id=:candidate_id`, {
                replacements: { candidate_id: c_id }
            }
        );
        const policyDescriptions = policies.map(policy => policy.Policy_description);

        // Fetch additional data: videos, ratings, user ratings, comments
        const videoRet = await videoSearch(resArr[0].Name);
        const ratingsRet = await this.getRatings(c_id);
        const userRating = USER ? await this.getUserRating(USER.user_id, c_id) : null;
        const comments = await getCandidateLiveChatComments(c_id);

        // If no comments were fetched, assign an empty array
        const finalComments = comments || [];
       

        // Otherwise, render the full page
        res.render('candidate', {
            candidate_id: c_id,
            candidate: resArr,
            videos: videoRet,
            ratings: ratingsRet,
            userRating: userRating,
            policies: policyDescriptions,
            comments: finalComments
        });

    } catch (err) {
        console.error(err);
        res.status(500).render('search', { error: 'An error occurred while fetching results.' });
    }
};

// Get average and total ratings for a candidate
exports.getRatings = async (candidate_id) => {
    try {
        const [ratings] = await db.query(
            `SELECT AVG(Rating_value) as averageRating, COUNT(*) as totalRatings FROM Ratings WHERE Candidate_id=:candidate_id`, {
                replacements: { candidate_id }
            }
        );
        return ratings[0];  // Returns average rating and count
    } catch (err) {
        console.error("Error fetching ratings:", err);
        return { averageRating: null, totalRatings: 0 };
    }
};

// Get user-specific rating for a candidate
exports.getUserRating = async (user_id, candidate_id) => {
    try {
        const [userRating] = await db.query(
            `SELECT Rating_value FROM Ratings WHERE User_id=:user_id AND Candidate_id=:candidate_id`, {
                replacements: { user_id, candidate_id }
            }
        );
        return userRating[0]?.Rating_value || null;  // Returns user's previous rating if exists
    } catch (err) {
        console.error("Error fetching user rating:", err);
        return null;
    }
};

// Set rating provided by the user
exports.setRatings = async (req, res) => {
    const USER = req.session.user;
    const { Candidate_id, rating_value } = req.body;

    if (!USER) {
        return res.redirect('/auth/signup');
    }

    try {
        const select = "SELECT * FROM Ratings WHERE User_id=:user_id AND Candidate_id=:candidate_id";
        const [results] = await db.query(select, {
            replacements: {
                user_id: USER.user_id,
                candidate_id: Candidate_id
            },
        });

        if (results.length > 0) {
            const updateQuery = "UPDATE Ratings SET Rating_value=:rating_value WHERE User_id=:user_id AND Candidate_id=:candidate_id";
            await db.query(updateQuery, {
                replacements: {
                    user_id: USER.user_id,
                    candidate_id: Candidate_id,
                    rating_value: rating_value
                },
            });
        } else {
            const insertQuery = "INSERT INTO Ratings (User_id, Candidate_id, Rating_value) VALUES (:user_id, :candidate_id, :rating_value)";
            await db.query(insertQuery, {
                replacements: {
                    user_id: USER.user_id,
                    candidate_id: Candidate_id,
                    rating_value: rating_value
                },
            });
        }

        res.redirect('/candidate?Candidate_id=' + Candidate_id);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while submitting the rating.' });
    }
};

// Fetch candidate live chat comments
const getCandidateLiveChatComments = async (candidateId) => {
    try {
        const [comments] = await db.query(
            `SELECT Comments.Comment AS commentText, Comments.Timestamp AS timestamp, RegisteredUsers.Username 
            FROM LiveChat AS Comments
            JOIN RegisteredUsers ON Comments.User_id = RegisteredUsers.user_id
            WHERE Comments.Candidate_id = :candidate_id
            ORDER BY Comments.Timestamp DESC`, {
                replacements: { candidate_id: candidateId }
            }
        );
        return comments;
    } catch (err) {
        console.error("Error fetching comments:", err);
        return [];
    }
};

exports.setUserComment = async (req, res, io) => {
    const USER = req.session.user;
    const candidateId = req.body.Candidate_id;
    const message = req.body.message;

    if (!candidateId || !message || !USER) {
        return res.status(400).json({ message: "Missing required fields: candidateId, message, or user_id." });
    }

    try {
        const insertQuery = `
            INSERT INTO LiveChat (Candidate_id, User_id, Comment, Timestamp)
            VALUES (:candidate_id, :user_id, :comment, :timestamp)`;
        const timestamp = new Date();

        await db.query(insertQuery, {
            replacements: {
                candidate_id: candidateId,
                user_id: USER.user_id,
                comment: message,
                timestamp: timestamp
            }
        });

        // Emit the new comment to all connected clients
        if (io) {
            io.emit('updateComments', {
                username: USER.username,
                commentText: message,
                timestamp: timestamp.toLocaleString()
            });
        }

        // After inserting the comment, redirect back to the candidate page
        res.redirect(`/results/candidate?Candidate_id=${candidateId}`);
    } catch (error) {
        console.error("Error in setUserComment:", error);
        res.status(500).json({ message: "Error submitting comment" });
    }
};


exports.newCandidate = async (req, res) => {
    if(!req.session.user || req.session.user.role != 'Admin') {
        return res.redirect('/auth/signup');
    }
    try {
        const [parties] = await db.query(
            `SELECT Party_name FROM PoliticalParty`
        );
        res.render('candidateForm', { parties });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching party data.' });
    }
    // res.render('candidateForm');
}

exports.createCandidate = async (req, res) => {
    if(!req.session.user || req.session.user.role != 'Admin') {
        return res.redirect('/auth/signup');
    }

    const { name, photo, policies, background, location, website, phone, party, street, city, state, zip, socialsfacebook, socialstwitter } = req.body;
    let socials = {};
    socials.facebook = socialsfacebook;
    socials.twitter = socialstwitter;

    let address = {};
    address.street = street;
    address.city = city;
    address.state = state;
    address.zip = zip;

    try {

        const partyId = await db.query(
            `SELECT Party_id FROM PoliticalParty WHERE Party_name LIKE :party`, {
                replacements: { party }
            }
        );

        const pId = partyId[0][0].Party_id;

        if (!pId) {
            res.redirect('/');
        }

        const [results] = await db.query(
            `INSERT INTO CandidateInfo (Name, Photo, Policies, Background, Location, Candidate_website, Phone, Party_id, Social, Address) VALUES (:name, :photo, :policies, :background, :location, :website, :phone, :pId, :socials, :address)`, {
                replacements: { 
                    name,
                    photo,
                    policies,
                    background,
                    location,
                    website,
                    phone,
                    pId,
                    socials: JSON.stringify(socials),
                    address: JSON.stringify(address)
                }
            }
        );

        res.redirect('/candidate?Candidate_id=' + results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the candidate.' });
    }
}



exports.newCandidateEvent = async (req, res) => {
    const {candidate_photo, candidate_name, candidate_id} = req.query;
    if(!req.session.user || req.session.user.role != 'Admin') {
        return res.redirect('/auth/signup');
    }
    res.render('candidateEventForm', {
        candidate_photo: candidate_photo,
        candidate_name: candidate_name,
        candidate_id: candidate_id
    });
}

exports.createCandidateEvent = async (req, res) => {
    if(!req.session.user || req.session.user.role != 'Admin') {
        return res.redirect('/auth/signup');
    }

    const {candidateid, eventname, location, date} = req.body

    try {

        await db.query(
            `INSERT INTO CandidateEvents (Candidate_id, Event_name, Location, Date) VALUES (:candidate_id, :eventname, :location, :date)`, {
                replacements: { 
                    candidate_id: candidateid,
                    eventname: eventname,
                    location: location,
                    date: date
                }
            }
        );
        res.redirect('/candidate?Candidate_id=' + candidateid);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the event.' });
    }
}

exports.newCandidatePolicy = async (req, res) => {
    const {candidate_photo, candidate_name, candidate_id} = req.query;
    if(!req.session.user || req.session.user.role != 'Admin') {
        return res.redirect('/auth/signup');
    }
    res.render('candidatePolicyForm', {
        candidate_photo: candidate_photo,
        candidate_name: candidate_name,
        candidate_id: candidate_id
    });
}

exports.createCandidatePolicy = async (req, res) => {
    if(!req.session.user || req.session.user.role != 'Admin') {
        return res.redirect('/auth/signup');
    }

    const {candidateid, policydescription} = req.body

    try {

        await db.query(
            `INSERT INTO CandidatePolicy (Candidate_id, Policy_description) VALUES (:candidate_id, :policydescription)`, {
                replacements: { 
                    candidate_id: candidateid,
                    policydescription: policydescription
                }
            }
        );
        res.redirect('/candidate?Candidate_id=' + candidateid);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the policy.' });
    }
}