const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Opportunity = require('../models/Opportunities');

// Create a new opportunity (Only organizations can create)
router.post('/', auth, async (req, res) => {
    const { title, description, skillsRequired, cause, location, date } = req.body;

    try {
        const newOpportunity = new Opportunity({
            title,
            description,
            skillsRequired,
            cause,
            location,
            date,
            organization: req.user.id
        });

        const opportunity = await newOpportunity.save();
        res.json(opportunity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all opportunities
router.get('/', async (req, res) => {
    try {
        const opportunities = await Opportunity.find().populate('organization', 'name');
        res.json(opportunities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get single opportunity by ID
router.get('/:id', async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id).populate('organization', 'name');
        if (!opportunity) return res.status(404).json({ msg: 'Opportunity not found' });
        res.json(opportunity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Sign Up for an opportunity
router.post('/:id/signup', auth, async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);
        if (!opportunity) return res.status(404).json({ msg: 'Opportunity not found' });

        // Check if already signed up
        if (opportunity.volunteers.includes(req.user.id)) {
            return res.status(400).json({ msg: 'Already signed up' });
        }

        opportunity.volunteers.push(req.user.id);
        await opportunity.save();

        res.json(opportunity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete an opportunity (Only organization who created it can delete)
router.delete('/:id', auth, async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);
        if (!opportunity) return res.status(404).json({ msg: 'Opportunity not found' });

        if (opportunity.organization.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await opportunity.remove();
        res.json({ msg: 'Opportunity removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;