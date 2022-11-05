const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  scheduledBy: {
    type: String,
    required: true,
  },

  scheduledAt: {
    type: String,
    required: true,
  },
  taskId: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
