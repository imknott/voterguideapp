// Core imports
var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');

// Database (Sequelize) import
var sequelize = require('./config/db');  // Sequelize connection instance

// Route imports
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/signup'); // Ensure this route handles login and signup
var aboutRouter = require('./routes/about');
var searchRouter = require('./routes/search');
var resultsRouter = require('./routes/results');
var candidateRouter = require('./routes/candidate');
var pollingRouter = require('./routes/polling');
var profileRouter = require('./routes/profile');

// Initialize Express app
var app = express();
const server = http.createServer(app);
const io = socketIo(server);

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/javascripts', express.static(path.join(__dirname, 'public/javascripts')));
app.use('/icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));


// Session middleware (for storing user info and managing sessions)
app.use(session({
  secret: process.env.SESSION_SECRET, // Use the secret from the .env file
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to make user info available in all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Set user to null if not logged in
  next();
});

// Add this to listen for a new comment and emit an event to all connected clients
io.on('connection', (socket) => {
  console.log('A user connected');

  // When a new comment is submitted, broadcast it to all connected clients
  socket.on('newComment', (comment) => {
      io.emit('updateComments', comment); // Emit the comment to all connected clients
  });

  socket.on('disconnect', () => {
      console.log('A user disconnected');
  });
});



// Add the route for the search page as the homepage
app.get('/', (req, res) => {
  res.render('search'); // Render your search page template
});

// Use the routes, passing `io` to each route handler
app.use('/candidate', (req, res, next) => {
  req.io = io;  // Attach `io` to the request object
  next();  // Call the next middleware or route handler
});

// Existing routes
app.use('/users', usersRouter);
app.use('/auth', signupRouter); // This should handle both login and signup
app.use('/about', aboutRouter);
app.use('/search', searchRouter);
app.use('/results', resultsRouter);
app.use('/candidate', candidateRouter);
app.use('/polling', pollingRouter);
app.use('/profile', profileRouter);

// Database synchronization and server startup
sequelize.sync()  // Sync Sequelize models with the database
  .then(() => {
    console.log('Database synchronized successfully.');

    const PORT = process.env.PORT || 8080; // Set port from environment variable or default to 8080
    // Start the server on the specified port
    app.listen(PORT, function () {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

// Error handling middleware
app.use(function (err, req, res, next) {
  // Set locals, only providing error details in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.redirect('/search'); // Redirect to search if there's an error
    }
    res.redirect('/'); // Redirect to home after logout
  });
});

// Route to handle saving the user's location
app.post('/save-location', async (req, res) => {
  const { lat, lon } = req.query;
  // Here you would typically save the latitude and longitude to the user's profile in the database
  console.log(`Location saved: Latitude ${lat}, Longitude ${lon}`);
  res.status(200).json({ message: 'Location saved successfully.' });
});

// Assuming you have a model or method to fetch the user's signup address
app.post('/use-signup-address', async (req, res) => {
  try {
    // Get the user's signup address from the session or database
    const userId = req.session.user.user_id;  // Access the logged-in user's ID from the session
    
    if (!userId) {
      return res.status(400).json({ error: 'User not logged in' });
    }

    // You need to fetch the user's address from the database (assuming it's saved during signup)
    // Example of querying the user's address from the database
    const user = await User.findOne({ where: { User_id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const address = user.address; // Assuming `address` is a column in the `Users` table

    // Send the address back to the frontend, or you could use it in some other way
    res.status(200).json({ address });

  } catch (error) {
    console.error('Error retrieving address:', error);
    res.status(500).json({ error: 'Failed to retrieve address' });
  }
});

// Start the server
server.listen(5000, () => {
  console.log('Server running on http://localhost:3000');
});

module.exports = app;
