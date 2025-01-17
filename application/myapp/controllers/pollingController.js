const db = require('../config/db');
require('dotenv').config({ path: 'makefile.env' });
const axios = require('axios');

exports.getPollingLocations = async (req, res) => {
    const address = address;

    if (!address) {
        return res.status(400).json({ error: 'Please provide an address.' });
    }

    try {
        const response = await axios.get('https://civicinfo.googleapis.com/civicinfo/v2/voterinfo', {
            params: {
                key: process.env.GOOGLECIVICINFORMATION_API_KEY,
                address: address,
                electionId: 2000 // Election ID for the presidential election (this can be looked up on Google Civic API docs)
            }
        });

        const pollingLocations = response.data.pollingLocations || [];
        res.render('pollinglocations', { pollingLocations });
    } catch (error) {
        console.error('Error fetching polling locations:', error.message);
        res.status(500).json({ error: 'Failed to retrieve polling locations. Please try again later.' });
    }
};
