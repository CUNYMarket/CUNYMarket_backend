const express = require("express");
const router = express.Router();
const { User } = require("../database");

// ✅ GET /api/users — get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password_hash"] },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ GET /api/users/:emplid — get one user by emplid
router.get("/:emplid", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.emplid, {
      attributes: { exclude: ["password_hash"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ✅ POST /api/users — register new user
router.post("/", async (req, res) => {
  try {
    const { emplid, email, password, username, phone_number } = req.body;

    if (!/@bmcc\.cuny\.edu$/i.test(email)) {
      return res.status(400).json({ error: "Only BMCC email addresses are allowed." });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already registered." });

    const password_hash = User.hashPassword(password);

    const newUser = await User.create({
      emplid,
      email,
      username,
      phone_number,
      password_hash,
    });

    res.status(201).json({
      message: "✅ User created successfully",
      user: {
        emplid: newUser.emplid,
        email: newUser.email,
        username: newUser.username,
        phone_number: newUser.phone_number,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// ✅ PUT /api/users/:emplid — update
router.put("/:emplid", async (req, res) => {
  try {
    const { username, phone_number, password } = req.body;
    const user = await User.findByPk(req.params.emplid);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (username) user.username = username;
    if (phone_number) user.phone_number = phone_number;
    if (password) user.password_hash = User.hashPassword(password);

    await user.save();
    res.json({ message: "✅ User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ✅ DELETE /api/users/:emplid — delete
router.delete("/:emplid", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.emplid);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();
    res.json({ message: "🗑️ User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// ✅ POST /api/users/login — verify password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const valid = user.checkPassword(password);
    if (!valid) return res.status(401).json({ error: "Invalid email or password" });

    res.json({
      message: "✅ Login successful",
      user: {
        emplid: user.emplid,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

module.exports = router;
