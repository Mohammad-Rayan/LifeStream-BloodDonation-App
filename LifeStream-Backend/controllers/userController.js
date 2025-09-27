const User = require('../models/User');
const generateToken = require('../utils/generateToken');


const registerUser = async (req, res) => {
    try {
        const data = req.body;
        const { email } = data;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User(data);
        const response = await newUser.save();
        res.status(201).json({ message: 'Signup successful', user: response });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid Password' });
        }

        const payload = {
            id: user._id,
            role: user.role
        };

        const token = generateToken(payload);
        res.json({ message: 'Login successful', token: token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const userProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const user = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, user, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const toggleUserRole = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'donor') {
            user.role = 'recipient';
        }
        else if (user.role === 'recipient') {
            user.role = 'donor';
        }
        else {
            return res.status(400).json({ error: 'User role is not togglable' });
        }
        await user.save();
        res.status(200).json({ message: 'User role updated successfully', role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = { registerUser, loginUser, userProfile, updateUser, deleteUser, toggleUserRole };