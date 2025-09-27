
// Main server file for LifeStream Blood Donation Application
const express = require('express');
const app = express();


// Load environment variables
const dotenv = require('dotenv');
dotenv.config();


// Enable Cross-Origin Resource Sharing
const cors = require('cors');
app.use(cors());


// Parse incoming JSON requests
const bodyParser = require('body-parser');
app.use(bodyParser.json());


// Log all incoming requests
const logger = require('./middlewares/logRequestMiddleware');
app.use(logger);


// Database connection
const db = require('./config/db');


// Home Route
app.get('/', (req, res) => {
    res.send('Welcome to LifeStream a Blood Donation Application');
});



// API Routes
const userRoutes = require('./routes/userRoutes');
const bloodRequestRoutes = require('./routes/bloodRequestRoutes')
app.use('/api/users', userRoutes);
app.use('/api/requests', bloodRequestRoutes);



// Start the server
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});