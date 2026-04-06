const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String, default: "Explorer" },
    position: {
        x: { type: Number, default: 400 },
        y: { type: Number, default: 300 }
    },
    lastActive: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);