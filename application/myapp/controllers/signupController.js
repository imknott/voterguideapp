const bcrypt = require('bcryptjs');
const db = require('../config/db'); // MySQL connection

exports.signup = async (req, res) => {
    const { email, password, confirmPassword, username, dob, address, name } = req.body;

    // Validate that passwords match
    if (password !== confirmPassword) {
        return res.render('signup', { error: 'Passwords do not match' });
    }

    try {
        let query = '';
        let results = [];

        // Check if email already exists in RegisteredUsers
        query = 'SELECT * FROM RegisteredUsers WHERE email = :email';
        [results] = await db.query(query, {
            replacements: { email },
        });
        if (results.length > 0) {
            return res.render('signup', { error: 'User with this email already exists' });
        }

        // Check if username is already taken in RegisteredUsers
        query = 'SELECT * FROM RegisteredUsers WHERE username = :username';
        [results] = await db.query(query, {
            replacements: { username },
        });
        if (results.length > 0) {
            return res.render('signup', { error: 'Username is already taken' });
        }

        // Hash the password using bcryptjs
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into Users table
        query = 'INSERT INTO Users (name, dob, address) VALUES (:name, :dob, :address)';
        const [userInsertResult] = await db.query(query, {
            replacements: { name, dob, address },
        });

        // Log the insert result to check if user_id is correct
        console.log('User Insert Result:', userInsertResult);

        // Ensure the insertion was successful and that userInsertResult is the result object
        if (!userInsertResult || !userInsertResult.insertId) {
            throw new Error('User insertion failed, no result returned.');
        }


        // Insert into RegisteredUsers table using the hashed password
        query = 'INSERT INTO RegisteredUsers (user_id, email, password, dob, age, username) VALUES (:user_id, :email, :password, :dob, :age, :username)';
        const [registeredUserInsertResult] = await db.query(query, {
            replacements: {
                user_id: userInsertResult, // Correct user_id value
                email,
                password: hashedPassword,  // Insert the hashed password here
                dob,
                age: new Date().getFullYear() - new Date(dob).getFullYear(),
                username,
            },
        });

        // Log the registered user insert result to check for success
        console.log('Registered User Insert Result:', registeredUserInsertResult);

        // Automatically log the user in and store info in session
        req.session.user = {
            username,
            email,
            user_id: userInsertResult, // Correct user_id from the insert
            address,
        };

        // Redirect to the search screen
        res.redirect('/search');
    } catch (error) {
        console.error('Error during signup:', error);  // Logs the full error
        res.status(500).render('signup', { error: 'Server error' });
    }
};




exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Debugging: Log the request body
    console.log('Request body:', req.body);

    try {
        let query = '';
        let results = [];

        // Check if the email exists in RegisteredUsers
        query = 'SELECT * FROM RegisteredUsers WHERE email = :email';
        [results] = await db.query(query, {
            replacements: { email },
        });

        // Debugging: Log the results array
        console.log('Query results:', results);

        if (results.length === 0) {
            console.log('No user found with that email');
            return res.render('signup', { error: 'User does not exist. Please sign up.' });
        }

        const user = results[0];

        query = 'SELECT * FROM UserRoles WHERE User_id = :user_id';
        [results] = await db.query(query, {
            replacements: { user_id: user.User_id },
        });

        if (results.length === 0) {
            console.log('No roles found for this user');
            return res.render('signup', { error: 'User does not have any roles assigned.' });
        }

        const returnedRole = results[0].Role_description;

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.Password); // Corrected to user.Password
        if (!isMatch) {
            return res.render('login', { error: 'Invalid password.' });
        }

        // Store user info in session
        req.session.user = {
            username: user.Username, // Corrected to user.Username
            email: user.Email,       // Corrected to user.Email
            user_id: user.User_id,
            address: user.address,
            role: returnedRole
        };

        // Redirect to homepage or search page
        res.redirect('/search');
    } catch (error) {
        console.error('Error logging in:', error);  // Logs the full error
        res.status(500).render('signup', { error: 'Server error, please try again later.' });
    }
};
