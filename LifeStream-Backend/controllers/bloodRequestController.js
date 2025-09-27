const mongoose = require("mongoose");
const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");

const createRequest = async (req, res) => {
    try {
        if (req.user.role !== "recipient") {
            return res.status(403).json({ error: "Only recipient can create requests" });
        }
        const { bloodGroup, units, location, dateNeeded, urgency, description, contactNumber } = req.body;
        const newRequest = new BloodRequest({
            bloodGroup,
            units,
            location,
            dateNeeded,
            urgency,
            description,
            contactNumber,
            recipientId: req.user.id,
        });
        const response = await newRequest.save();
        res.status(201).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const fulfillRequest = async (req, res) => {
    try {
        const requestID = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(requestID)) {
            return res.status(400).json({ error: "Invalid request ID" });
        }

        const request = await BloodRequest.findById(requestID);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        if (req.user.role !== "donor") {
            return res.status(403).json({ error: "Only donors can fulfill requests" });
        }

        if (request.status === "fulfilled") {
            return res.status(400).json({ error: "Request already fulfilled" });
        }

        if (request.status === "cancelled") {
            return res.status(400).json({ error: "Request has been cancelled" });
        }

        const user = await User.findById(req.user.id);
        if(user.bloodGroup !== request.bloodGroup) {
            return res.status(400).json({ error: "Donor's blood group does not match the request" });
        }

        if(user.location !== request.location) {
            return res.status(400).json({ error: "Donor's location does not match the request" });
        }

        // Update request
        request.donorId = req.user.id;
        request.status = "fulfilled";
        request.fulfilledAt = Date.now();
        await request.save();

        // Update donor's donation history
        const donor = await User.findById(req.user.id);
        donor.donationHistory.push({ requestId: request._id });
        await donor.save();

        res.status(200).json({ message: "Blood request fulfilled successfully", bloodRequest: request });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const cancelRequest = async (req, res) => {
    try {
        const requestID = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(requestID)) {
            return res.status(400).json({ error: "Invalid request ID" });
        }

        const request = await BloodRequest.findById(requestID);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        if (req.user.role !== "admin" && req.user.role !== "recipient") {
            return res.status(403).json({ error: "Only recipient and admin can cancel request" });
        }

        if (request.status === "fulfilled") {
            return res.status(400).json({ error: "Request already fulfilled" });
        }

        if (request.status === "cancelled") {
            return res.status(400).json({ error: "Request has been cancelled" });
        }

        // Update request
        request.status = "cancelled";
        await request.save();
        res.status(200).json({ message: "Blood request canceled successfully", bloodRequest: request });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getRequests = async (req, res) => {
    try {
        let requests = [];
        if (req.user.role === "recipient") {
            requests = await BloodRequest.find({ recipientId: req.user.id });
        }
        else if (req.user.role === "donor") {
            const user = await User.findById(req.user.id);
            requests = await BloodRequest.find({
                bloodGroup: user.bloodGroup,
                location: user.location,
                status: "pending",
            });
        }
        else {
            requests = await BloodRequest.find();
        }

        if (requests.length === 0) {
            return res.status(404).json({ error: "No requests found" });
        }

        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getRequestById = async (req, res) => {
    try {
        const requestID = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(requestID)) {
            return res.status(400).json({ error: "Invalid request ID" });
        }
        const request = await BloodRequest.findById(requestID);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }
        res.json(request);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getDonationHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const requests = await BloodRequest.find({ donorId: userId, status: 'fulfilled' });
        if (requests.length === 0) {
            return res.status(404).json({ error: 'No donation history found' });
        }
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getUserRequestHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const requests = await BloodRequest.find({ recipientId: userId });
        if (requests.length === 0) {
            return res.status(404).json({ error: 'No request history found' });
        }
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createRequest, fulfillRequest, cancelRequest, getRequests, getDonationHistory, getUserRequestHistory, getRequestById };