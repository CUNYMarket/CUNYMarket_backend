const db = require("./db");
const { User, Post, Chat } = require("./index");

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

    // 3️⃣ Create posts (each tied to a userId → User.emplid)
    const posts = await Post.bulkCreate([
      {
        title: "TI-84 Plus Calculator",
        description: "Lightly used calculator in perfect condition. Ideal for math and stats classes.",
        price: 50.0,
        category: "Calculators",
        location: "BMCC Library Entrance",
        image_url: null,
        userId: 123456,
      },
      {
        title: "Psychology 101 Textbook",
        description: "Trade only. Looking to exchange for COM 101 book.",
        price: null,
        category: "Textbooks",
        location: "Cafeteria, 3rd Floor",
        image_url: null,
        userId: 789012,
      },
      {
        title: "MacBook Air (2017)",
        description: "Fully functional, some cosmetic wear. Great for note-taking.",
        price: 300.0,
        category: "Electronics",
        location: "Main Building Lobby",
        image_url: null,
        userId: 901234,
      },
      {
        title: "Intro to Statistics Notes",
        description: "Comprehensive handwritten notes with summaries and solved examples.",
        price: 15.0,
        category: "Study Materials",
        location: "BMCC Library 5th Floor",
        image_url: null,
        userId: 345678,
      },
      {
        title: "Reusable Water Bottle (Hydro Flask)",
        description: "Brand new, never used. Keep drinks cold all day!",
        price: 20.0,
        category: "Accessories",
        location: "FitRec Entrance",
        image_url: null,
        userId: 567890,
      },
      {
        title: "COM 2000 Group Project Kit",
        description: "Poster board, markers, sticky notes, and supplies for presentations.",
        price: 10.0,
        category: "Supplies",
        location: "NAC Study Lounge",
        image_url: null,
        userId: 123456,
      },
      {
        title: "Headphones (Sony WH-1000XM4)",
        description: "Noise-cancelling headphones in excellent condition. Selling because I upgraded.",
        price: 180.0,
        category: "Electronics",
        location: "BMCC Entrance Hall",
        image_url: null,
        userId: 789012,
      },
    ]);

    console.log(`🛍️ Seeded ${posts.length} posts`);

    // 4️⃣ Seed chat data
    const chats = [
      {
        name: "BMCC Study Group",
        is_group: true,
        created_by: 123456,
        users: [123456, 789012, 345678],
      },
      {
        name: null,
        is_group: false,
        created_by: 789012,
        users: [789012, 567890],
      },
      {
        name: "Marketing Project Team",
        is_group: true,
        created_by: 345678,
        users: [345678, 901234, 789012],
      },
      {
        name: null,
        is_group: false,
        created_by: 901234,
        users: [901234, 123456],
      },
      {
        name: "Weekend Meetup",
        is_group: true,
        created_by: 567890,
        users: [567890, 123456, 789012, 345678],
      },
    ];

    await Chat.bulkCreate(chats);
    console.log(`💬 Seeded ${chats.length} chats`);

    // 5️⃣ Verify
    const [userCount, postCount, chatCount] = await Promise.all([
      User.count(),
      Post.count(),
      Chat.count(),
    ]);
    console.log(
      `✅ Seed complete: ${userCount} users, ${postCount} posts, ${chatCount} chats created.`
    );
  } catch (err) {
    console.error("❌ Error during seed:", err);
  } finally {
    await db.close();
    console.log("🔒 Database connection closed");
  }
};

seed();

