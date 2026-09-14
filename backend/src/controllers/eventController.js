const Event = require("../models/Event");

// @desc    Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const { search, category, location } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          location: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = location;
    }
    const events = await Event.find(filter);
    return res.status(200).json({ events });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json({ event });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      category,
      totalSeats,
      price,
      imageURL,
    } = req.body;
    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      totalSeats,
      availableSeats: totalSeats,
      price,
      imageURL,
      createdBy: req.user._id,
    });
    return res
      .status(201)
      .json({ message: "Event created successfully", event });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating event", error: error.message });
  }
};

// @desc    Update an event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const {
      title,
      description,
      date,
      location,
      category,
      totalSeats,
      price,
      imageURL,
    } = req.body;

    // Update only the fields that are provided in the request body
    event.title = title ?? event.title;
    event.description = description ?? event.description;
    event.date = date ?? event.date;
    event.location = location ?? event.location;
    event.category = category ?? event.category;
    event.price = price ?? event.price;
    event.imageURL = imageURL ?? event.imageURL;

    if (totalSeats !== undefined) {
      // Adjust availableSeats based on the change in totalSeats
      const bookedSeats = event.totalSeats - event.availableSeats;
      if (totalSeats < bookedSeats) {
        return res.status(400).json({
          message: `Total seats cannot be less than booked seats (${bookedSeats})`,
        });
      }

      const seatsDifference = totalSeats - event.totalSeats;
      event.totalSeats = totalSeats;
      event.availableSeats += seatsDifference;
    }

    const updatedEvent = await event.save();
    return res
      .status(200)
      .json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating event", error: error.message });
  }
};

// @desc    Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting event", error: error.message });
  }
};
