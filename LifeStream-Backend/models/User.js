const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['donor', 'recipient', 'admin'] },
    bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    donationHistory: [{
        requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest' },
        date: { type: Date, default: Date.now }
    }],
    requestHistory: [{
        requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest' },
        status: { type: String, enum: ['pending', 'fulfilled', 'cancelled'] },
        date: { type: Date, default: Date.now }
    }],
});

// Paasword hashing
userSchema.pre('save', async function (next) {
    try {
        const user = this;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    }
    catch (err) {
        return next(err);
    }
})

// Compare password
userSchema.methods.comparePassword = async function (candidatePasswod) {
    try {
        const user = this;
        const isMatch = await bcrypt.compare(candidatePasswod, user.password);
        console.log(isMatch);
        return isMatch;
    }
    catch (err) {
        throw err;
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;