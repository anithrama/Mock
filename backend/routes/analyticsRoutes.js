const express = require('express');
const router = express.Router();
const Outcome = require('../models/outcome');
const Decision = require('../models/Decision');

router.get('/', async (_req, res) => {
  try {
    const outcomes = await Outcome.find();
    const evaluatedCount = outcomes.length;
    const successfulOutcomes = outcomes.filter((outcome) => outcome.result === 'Success').length;

    const successRate = evaluatedCount > 0
      ? Number(((successfulOutcomes / evaluatedCount) * 100).toFixed(2))
      : 0;

    const averageRating = evaluatedCount > 0
      ? Number((outcomes.reduce((sum, outcome) => sum + outcome.rating, 0) / evaluatedCount).toFixed(2))
      : 0;

    const successfulDecisionIds = outcomes
      .filter((outcome) => outcome.result === 'Success')
      .map((outcome) => outcome.decisionId);

    let mostSuccessfulCategory = null;

    if (successfulDecisionIds.length > 0) {
      const successfulDecisions = await Decision.find({ _id: { $in: successfulDecisionIds } });
      const categoryCounts = successfulDecisions.reduce((acc, decision) => {
        acc[decision.category] = (acc[decision.category] || 0) + 1;
        return acc;
      }, {});

      mostSuccessfulCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0];
    }

    res.json({
      successRate,
      mostSuccessfulCategory,
      averageRating,
      evaluatedCount,
      successfulCount: successfulOutcomes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to compute analytics' });
  }
});

module.exports = router;
