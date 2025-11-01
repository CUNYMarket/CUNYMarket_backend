const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../database");

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const JWT_EXPIRATION = "7d";

//--------------------------------------
// REGISTER
//--------------------------------------
router.post("/register", async (req, res) => {
  try {
    const { email, username, password, phone_number, emplid } = req.body;

    if (!email || !username || !password || !phone_number || !emplid) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const password_hash = User.hashPassword(password);

    const user = await User.create({
      email,
      username,
      phone_number,
      emplid,
      password_hash,
    });

    res.status(201).json({
      message: "✅ User registered successfully",
      user: {
        emplid: user.emplid,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

//--------------------------------------
// LOGIN
//--------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { emplid: user.emplid, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    res.json({
      message: "✅ Login successful",
      token,
      user: {
        emplid: user.emplid,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error logging in" });
  }
});

//--------------------------------------
// VERIFY (GET /auth/verify)
//--------------------------------------
const { authenticateToken } = require("./middleware");

router.get("/verify", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.emplid, {
      attributes: ["emplid", "email", "username", "phone_number"],
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "✅ Token valid", user });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ error: "Error verifying user" });
  }
});

//--------------------------------------
// LOGOUT
//--------------------------------------
router.post("/logout", (req, res) => {
  // JWTs are stateless; logout just means the client deletes the token
  res.json({ message: "✅ Logged out successfully" });
});

module.exports = router;
