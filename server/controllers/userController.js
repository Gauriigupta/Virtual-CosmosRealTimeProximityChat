const User = require('../Models/User.Model');

const handleUserConnection = async (socketId) => {
    try {
        // Check if user exists (using socketId as temp userId)
        let user = await User.findOne({ userId: socketId });
        if (!user) {
            user = await User.create({
                userId: socketId,
                username: `Explorer-${socketId.substring(0, 4)}`,
                position: { x: 400, y: 300 }
            });
        }
        return user;
    } catch (err) {
        console.error("DB Error:", err);
    }
};

const saveUserSession = async (socketId, position) => {
    try {
        await User.findOneAndUpdate(
            { userId: socketId },
            {
                position: { x: position.x, y: position.y },
                lastActive: Date.now()
            }
        );
    } catch (err) {
        console.error("Save Error:", err);
    }
};

module.exports = { handleUserConnection, saveUserSession };