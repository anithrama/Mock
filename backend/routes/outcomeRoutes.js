const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Outcome = require('../models/outcome');
const Decision = require('../models/Decision');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post('/', async (req, res) => {
  try {
    const { decisionId } = req.body;

    if (!isValidObjectId(decisionId)) {
      return res.status(400).json({ message: 'Invalid decision ID' });
    }

    const decision = await Decision.findById(decisionId);
    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    const existing = await Outcome.findOne({ decisionId });
    if (existing) {
      return res.status(409).json({ message: 'Outcome already exists for this decision' });
    }

    const outcome = await Outcome.create(req.body);
    res.status(201).json(outcome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/decision/:decisionId', async (req, res) => {
  try {
    const { decisionId } = req.params;

    if (!isValidObjectId(decisionId)) {
      return res.status(400).json({ message: 'Invalid decision ID' });
    }

    const outcome = await Outcome.findOne({ decisionId });
    if (!outcome) {
      return res.status(404).json({ message: 'Outcome not found for this decision' });
    }

    res.json(outcome);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch outcome' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid outcome ID' });
    }

    const updated = await Outcome.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Outcome not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid outcome ID' });
    }

    const deleted = await Outcome.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Outcome not found' });
    }

    res.json({ message: 'Outcome deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete outcome' });
  }
});

module.exports = router;
