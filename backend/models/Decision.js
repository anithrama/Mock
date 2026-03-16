const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [120, 'Title cannot exceed 120 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [5, 'Description must be at least 5 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: ['Career', 'Finance', 'Personal', 'Health', 'Education', 'Other'],
  },
  expectedOutcome: {
    type: String,
    required: [true, 'Expected outcome is required'],
    trim: true,
    minlength: [3, 'Expected outcome must be at least 3 characters'],
    maxlength: [1000, 'Expected outcome cannot exceed 1000 characters'],
  },
  decisionDate: {
    type: Date,
    required: [true, 'Decision date is required'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Decision', decisionSchema);
