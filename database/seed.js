const db = require("./database");
const { User } = require("./index");

const seed = async () => {
    try {
        db.logging = false;
        await db.sync({ force: true }); // Drop and recreate tables

        const users = await User.bulkCreate([ 
            { emplid: 23278955, password_hash: User.hashPassword("123456"), email: "example@bmcc.cuny.edu"}
        ]);

        console.log(`Created ${users.length} user(s)`);
    } catch (error) {
        console.error("Error seeding database:", error);
        if (error.message.includes("does not exist")) {
            console.log("\n Have you created your database?");
        }
    }
    db.close();
};

seed();

