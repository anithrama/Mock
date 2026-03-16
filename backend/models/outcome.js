const mongoose = require('mongoose');

const outcomeSchema = new mongoose.Schema({
  decisionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Decision',
    required: [true, 'Decision ID is required'],
    unique: true,
  },
  result: {
    type: String,
    required: [true, 'Result is required'],
    enum: ['Success', 'Failure'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be between 1 and 5'],
    max: [5, 'Rating must be between 1 and 5'],
  },
  lessonsLearned: {
    type: String,
    required: [true, 'Lessons learned is required'],
    trim: true,
    minlength: [3, 'Lessons learned must be at least 3 characters'],
    maxlength: [1500, 'Lessons learned cannot exceed 1500 characters'],
  },
  outcomeDate: {
    type: Date,
    required: [true, 'Outcome date is required'],
  },
}, {
  timestamps: true,
});
module.exports = mongoose.model('Outcome', outcomeSchema);
