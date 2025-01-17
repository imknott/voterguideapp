const natural = require('natural');
const { Op } = require('sequelize');
const axios = require('axios'); // Import Op directly from Sequelize
const sequelize = require('../config/db'); // Import sequelize connection
const CandidateSearchView = require('../models/CandidateSearchView');
const { CandidateInfo } = require('../models/CandidateInfo');


// Synonym mapping for broader search terms
const synonymMap = {
    "supports": ["backs", "advocates for", "endorses","support", "represents"],
    "climate": ["climate change", "environmental protection", "sustainability", "global warming", "the climate", ""],
    "movements": ["initiatives", "campaigns"],
    "democratic": ["democrats", "dem party", 'dems','the democratic party'],
    "republican": ["republicans", "gop", "rep party",'the republican party', 'reps'],
    "social": ["social justice", "social equality", "social welfare"],
    "economic": ["economy", "economic growth", "economic development","econ", "econmic", "the economic reform", "econo", ],
    "healthcare": ["health care", "medical care", "health insurance",'affordable health care', ],
    "education": ["educational", "schools", "learning", 'better education'],
    "immigration": ["immigrants", "immigration reform", "border control", 'border protection', 'open borders'],
    "gun control": ["gun laws", "firearms", "gun rights","guns"],
    "taxes": ["tax reform", "taxation", "tax policy", "lower tax", "low tax", "tax"],
    "foreign policy": ["foreign relations", "diplomacy", "international relations"],
    "reproductive rights":["pro choice", "birth control", "women's rights"],
    "energy": ["energy policy", "fossil fuels", "renewable energy"],
    "housing": ["affordable housing", "housing market", "home ownership"],
    "transportation": ["transportation policy", "roads", "highways", "public transportation"],
    "voting rights": ["voting laws", "election reform", "voting rights"],
    "criminal justice": ["prison reform", "police reform", "justice system"],
    "labor": ["workers rights", "union", "labor laws"],
    "environmental protection": ["conservation", "ecology", "wildlife"],
    "trade": ["trade policy", "tariffs", "free trade"],
    "national security": ["defense policy", "military", "intelligence"],
    "technology": ["tech policy", "cybersecurity", "artificial intelligence"],
    "food": ["food policy", "agriculture", "nutrition"],
    "disability": ["disability rights", "disability access"],
    "local": ["near me", "in my area", "district", "local government", "county", "town", "city", "municipal"],
    "state": ["state government", "state legislature", "state representative"],
    "federal": ["federal government", "congress", "senate", "house"]

    // Add other synonyms as needed
};

// Helper to expand synonyms
function expandSearchTerm(searchTerm) {
    let expandedTerms = [searchTerm];

    Object.keys(synonymMap).forEach(key => {
        if (searchTerm.includes(key)) {
            synonymMap[key].forEach(synonym => {
                expandedTerms.push(searchTerm.replace(key, synonym));
            });
        }
    });

    return expandedTerms;
}

// Helper to stem terms
function stemTerm(term) {
    return natural.PorterStemmer.stem(term);
}

exports.searchCandidates = async (req, res) => {
    let address = req.session.address;
    let searchTerm = req.query.searchTerm || '';
    console.log(`Search Term: "${searchTerm}"`);

    searchTerm = searchTerm.toLowerCase();
    const stemmedSearchTerm = stemTerm(searchTerm);

    try {
        let results = [];

        // Query: "Who is the leader of [party]?"
        if (searchTerm.includes("leader of")) {
            const partyName = searchTerm.split("leader of")[1].trim();
            const expandedPartyTerms = expandSearchTerm(partyName);

            results = await CandidateSearchView.findAll({
                where: {
                    [Op.or]: expandedPartyTerms.map(term => ({
                        Party_name: { [Op.like]: `%${term}%` },
                        party_leader: { [Op.like]: `%${term}%` }
                    }))
                }
            });
        }
        // Query: "Which candidates support [policies]?"
        else if (searchTerm.includes("support")) {
            const policyQuery = searchTerm.split("support")[1].trim();
            const expandedPolicyTerms = expandSearchTerm(policyQuery);

            results = await CandidateSearchView.findAll({
                where: {
                    [Op.or]: expandedPolicyTerms.map(term => ({
                        Policy_description: { [Op.like]: `%${term}%` }
                    }))
                }
            });
        }
        // Query: "Who is [candidate name]?"
        else if (searchTerm.includes("who is")) {
            const candidateName = searchTerm.replace("who is", "").trim();

            results = await CandidateSearchView.findAll({
                where: {
                    Name: { [Op.like]: `%${candidateName}%` }
                }
            });
        }
        // General search query
        else {
            const expandedTerms = expandSearchTerm(searchTerm);

            results = await CandidateSearchView.findAll({
                where: {
                    [Op.or]: expandedTerms.flatMap(term => [
                        { Name: { [Op.like]: `%${term}%` } },
                        { Policy_description: { [Op.like]: `%${term}%` } },
                        { Event_name: { [Op.like]: `%${term}%` } },
                        { event_location: { [Op.like]: `%${term}%` } },
                        { Party_name: { [Op.like]: `%${term}%` } },
                        { party_leader: { [Op.like]: `%${term}%` } }
                    ])
                }
            });
        }

        console.log('Query Results:', results);

        // Filter duplicates and limit to 5 results
        let filteredResults = [];
        let seenCandidates = new Set();
        results.forEach(candidate => {
            if (!seenCandidates.has(candidate.Candidate_id)) {
                filteredResults.push(candidate.dataValues);
                seenCandidates.add(candidate.Candidate_id);
            }
        });

        res.render('results', {
            results: filteredResults,
            searchTerm,
        });

    } catch (err) {
        console.error(err);
        res.status(500).render('search', { error: 'An error occurred while fetching results.' });
    }
};


exports.searchHistory = async (userId) => {
    try {
        const [results] = await sequelize.query(
            `SELECT * FROM SearchHistory 
             WHERE User_id = :userId 
             ORDER BY Timestamp DESC 
             LIMIT 10`, // Use capitalized column names
            {
                replacements: { userId },
            }
        );

        return results; // results is already an array of objects
    } catch (error) {
        console.error('Error fetching search history:', error);
        throw error; // Rethrow the error to be caught in the route handler
    }
};

exports.getPresident = async (req, res) => {
    try {
        const query = "SELECT * FROM CandidateInfo WHERE Background REGEXP 'th President'";

        const [results] = await sequelize.query(query);

        if (results.length > 0) {

            results.sort((a, b) => {
                const aMatch = a.Background.match(/(\d+)th President/);
                const bMatch = b.Background.match(/(\d+)th President/);

                const aNumber = aMatch ? parseInt(aMatch[1], 10) : 0;
                const bNumber = bMatch ? parseInt(bMatch[1], 10) : 0;

                return bNumber - aNumber;
            });

            const president = results[0];

            res.redirect('/results/candidate?Candidate_id=' + president.Candidate_id);
        } else {
            console.log('No president found.');
            res.render('search', { error: 'No president found.' });
        }
    } catch (error) {
        console.error('Error fetching president:', error);
        res.status(500).render('search', { error: 'An error occurred while fetching the president.' });
    }
}


// WIP
exports.getElection = async (req, res) => {
    try {
        const query = "SELECT * FROM ElectionInfo";

        const [results] = await sequelize.query(query);

        if (results.length > 0) {

        }

        res.render('search');

    } catch (error) {
        console.error('Error fetching election:', error);
        res.status(500).render('search', { error: 'An error occurred while fetching the election.' });
    }
}