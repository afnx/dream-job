const express = require('express');
const { getAIClient } = require('../ai/ai-service');

const router = express.Router();

// POST /api/jobs/parse
router.post("/parse", async (req, res) => {
    try {
        const { userInput } = req.body;
        const ai = getAIClient();
        const result = await ai.extractJobQueryDetails(userInput);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to parse input" });
    }
});

// POST /api/jobs/rank
router.post("/rank", async (req, res) => {
    try {
        const { userInput, jobListings } = req.body;
        const ai = getAIClient();
        const result = await ai.rankJobListings(userInput, jobListings);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to rank listings" });
    }
});

module.exports = router;