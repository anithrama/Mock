const express = require('express');
const mongoose = require('mongoose');
const Decision = require('../models/Decision');
const Outcome = require('../models/outcome');

const router = express.Router();

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post('/', async (req, res) => {
  try {
    const decision = await Decision.create(req.body);
    res.status(201).json(decision);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (_req, res) => {
  try {
    const decisions = await Decision.find().sort({ decisionDate: -1 });
    res.json(decisions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch decisions' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid decision ID' });
    }

    const decision = await Decision.findById(req.params.id);
    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    res.json(decision);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch decision' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid decision ID' });
    }

    const updated = await Decision.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid decision ID' });
    }

    const deleted = await Decision.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    await Outcome.deleteOne({ decisionId: req.params.id });
    res.json({ message: 'Decision deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete decision' });
  }
});

module.exports = router;
