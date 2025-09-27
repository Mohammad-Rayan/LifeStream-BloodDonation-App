const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
    bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
    units: { type: Number, required: true, min: 1 },
    location: { type: String, required: true },
    dateNeeded: { type: String, required: true },
    urgency: { type: String, required: true, enum: ['Critical', 'High', 'Medium', 'Low'] },
    description: { type: String, required: true },
    contactNumber: { type: String, required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Null until a donor accepts
    status: { type: String, enum: ['pending', 'fulfilled', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    fulfilledAt: { type: Date, default: null } // Null until fulfilled
});

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);
module.exports = BloodRequest;