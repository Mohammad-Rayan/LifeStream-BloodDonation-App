const express = require('express');
const { createRequest, fulfillRequest, cancelRequest, getRequests, getDonationHistory, getUserRequestHistory, getRequestById } = require('../controllers/bloodRequestController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createRequest);
router.patch('/:id/fulfill', authenticate, fulfillRequest);
router.patch('/:id/cancel', authenticate, cancelRequest);
router.get('/', authenticate, getRequests);
router.get('/:id', authenticate, getRequestById);
router.get('/history', authenticate, getDonationHistory);
router.get('/my-requests', authenticate, getUserRequestHistory);

module.exports = router;