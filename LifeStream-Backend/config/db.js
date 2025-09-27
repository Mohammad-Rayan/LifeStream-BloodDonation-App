const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_URI;
mongoose.connect(mongoURL);
const db = mongoose.connection;

// Events
db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});


module.exports = db;