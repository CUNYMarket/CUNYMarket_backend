const db = require("./db");
const { User } = require("./index");

const seed = async () => {
  try {
    // 1️⃣ Drop & recreate all tables
    await db.sync({ force: true });
    console.log("🧹 Database synced (all tables recreated)");

    // 2️⃣ Seed user data
    const users = [
      {
        emplid: 123456,
        email: "alex.smith@bmcc.cuny.edu",
        username: "alexsmith",
        phone_number: 9175551111,
        password_hash: User.hashPassword("password123"),
      },
      {
        emplid: 789012,
        email: "jordan.lee@bmcc.cuny.edu",
        username: "jordanlee",
        phone_number: 9175552222,
        password_hash: User.hashPassword("securepass"),
      },
      {
        emplid: 345678,
        email: "emily.hernandez@bmcc.cuny.edu",
        username: "emilyh",
        phone_number: 9175553333,
        password_hash: User.hashPassword("bmccrocks"),
      },
      {
        emplid: 901234,
        email: "michael.chen@bmcc.cuny.edu",
        username: "mikechen",
        phone_number: 9175554444,
        password_hash: User.hashPassword("mysecretpw"),
      },
      {
        emplid: 567890,
        email: "sophia.perez@bmcc.cuny.edu",
        username: "sophiap",
        phone_number: 9175555555,
        password_hash: User.hashPassword("12345678"),
      },
    ];

    await User.bulkCreate(users);
    console.log("🌱 Seed data inserted successfully!");

    // 3️⃣ Verify
    const count = await User.count();
    console.log(`✅ Seed complete: ${count} users created.`);
  } catch (err) {
    console.error("❌ Error during seed:", err);
  } finally {
    await db.close();
    console.log("🔒 Database connection closed");
  }
};

seed();

