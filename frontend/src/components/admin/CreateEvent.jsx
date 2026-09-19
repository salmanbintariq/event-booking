import { useState, useRef, useEffect } from "react";
import api from "../../utils/axios";
import LoadingSpinner from "../LoadingSpinner";

const initialEventData = {
  title: "",
  description: "",
  date: "",
  location: "",
  category: "",
  totalSeats: "",
  price: "",
  image: null,
};

const CreateEvent = ({ onClose, event, onEventUpdated, onEventCreated }) => {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(initialEventData);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("date", formData.date);
      data.append("location", formData.location);
      data.append("category", formData.category);
      data.append("totalSeats", formData.totalSeats);
      data.append("price", formData.price);

      // Only send image if a new image was selected
      if (formData.image) {
        data.append("image", formData.image);
      }

      if (event) {
        // Edit mode
        const response = await api.put(`/events/${event._id}`, data);

        // Update event in AdminDashboard state
        onEventUpdated(response.data.event);

        // Close edit modal
        onClose();

        return;
      } else {
        // Create mode
        await api.post("/events", data);

        setFormData(initialEventData);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setSuccessMessage("Event created successfully.");
      }
    } catch (error) {
      console.error(
        "Error saving event:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date
          ? new Date(event.date).toISOString().split("T")[0]
          : "",
        location: event.location,
        category: event.category,
        totalSeats: event.totalSeats,
        price: event.price,
        image: null,
      });
    } else {
      setFormData(initialEventData);
    }
  }, [event]);

  return (
    <section className="relative rounded-xl border border-border bg-surface p-6 shadow-sm">
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-2xl text-text-muted transition hover:bg-gray-200 hover:text-text"
        aria-label="Close"
      >
        &times;
      </button>

      <h2 className="text-xl font-semibold text-text">
        {event ? "Edit Event" : "Create Event"}
      </h2>

      <p className="mt-1 text-sm text-text-muted">
        {event
          ? "Update the event details."
          : "Add a new event to the platform."}
      </p>

      {successMessage && (
        <div className="mb-6 rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm font-medium text-success">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-text"
          >
            Event Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            required
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition placeholder:text-text-muted focus:border-primary"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-text"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your event"
            rows="4"
            required
            className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition placeholder:text-text-muted focus:border-primary"
          />
        </div>

        {/* Date + Location */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium text-text"
            >
              Event Date
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-text"
            >
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Lahore"
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition placeholder:text-text-muted focus:border-primary"
            />
          </div>
        </div>

        {/* Category + Seats + Price */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-text"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
            >
              <option value="">Select category</option>
              <option value="Technology">Technology</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
              <option value="Workshop">Workshop</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="totalSeats"
              className="mb-2 block text-sm font-medium text-text"
            >
              Total Seats
            </label>

            <input
              id="totalSeats"
              name="totalSeats"
              type="number"
              min="1"
              value={formData.totalSeats}
              onChange={handleChange}
              placeholder="100"
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition placeholder:text-text-muted focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-medium text-text"
            >
              Price (PKR)
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="1500"
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition placeholder:text-text-muted focus:border-primary"
            />
          </div>
        </div>

        {/* Image */}
        <div>
          <label
            htmlFor="image"
            className="mb-2 block text-sm font-medium text-text"
          >
            Event Image
          </label>

          <input
            ref={fileInputRef}
            id="image"
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleChange}
            required
            className="block w-full cursor-pointer rounded-lg border border-border bg-surface text-sm text-text-muted file:mr-4 file:border-0 file:bg-primary file:px-4 file:py-3 file:font-medium file:text-white hover:file:bg-primary-hover"
          />

          <p className="mt-2 text-xs text-text-muted">
            PNG, JPG or WebP. Maximum size: 5 MB.
          </p>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoadingSpinner variant="light" />
                {event ? "Updating..." : "Creating..."}
              </>
            ) : event ? (
              "Update Event"
            ) : (
              "Create Event"
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateEvent;
