const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI;

        await mongoose.connect(dbURI);
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;