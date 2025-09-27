const express = require('express');
const { registerUser, loginUser, userProfile, updateUser, deleteUser, toggleUserRole } = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticate, userProfile);
router.put('/update/:id', authenticate, updateUser);
router.delete('/delete/:id', authenticate, deleteUser);
router.patch('/toggle-role', authenticate, toggleUserRole);

module.exports = router;