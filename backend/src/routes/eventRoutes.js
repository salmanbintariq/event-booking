const express = require('express');
const { protect, admin } = require("../middleware/authMiddleware");
const { getAllEvents, createEvent, getEventById, updateEvent, deleteEvent } = require("../controllers/eventController");


const router = express.Router();

// Get all events
router.get('/', getAllEvents);

// Get event by ID
router.get('/:id', protect, getEventById);

// Create event (admin only)
router.post('/', protect, admin, createEvent);

// Update event (admin only)
router.put('/:id', protect, admin, updateEvent);

// Delete event (admin only)
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;