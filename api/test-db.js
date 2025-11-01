const express = require('express');
const router = express.Router();
const { User } = require("../database");

router.get("/users", async (req, res) => {
    try {
        const users = await User.findAll();
        console.log(`Found ${users.length}`);
        res.json({
            message: "You successfully connected to the database",
            usersCount: users.length,
        });
    } catch (error) {
        console.error("Error fetching users:", error.messae);
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch users",
            details: error.message,
            message:
            "Check your database connection, and consider running seed file: npm run seed",
        });
    }
});

module.exports = router;