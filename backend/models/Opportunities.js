const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    skillsRequired: [String],
    cause: String,
    location: String,
    date: Date,
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);