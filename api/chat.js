const express = require("express");
const router = express.Router();
const { Chat, User } = require("../database");
const { Op } = require("sequelize");

// ✅ GET /api/chats — get all chats (optionally filter by user or group)
router.get("/", async (req, res) => {
  try {
    const { user, is_group } = req.query;

    const where = {};

    // Filter by user participation (Postgres array containment)
    if (user) where.users = { [Op.contains]: [parseInt(user)] };

    // Filter by group/private type
    if (is_group !== undefined) where.is_group = is_group === "true";

    const chats = await Chat.findAll({
      where,
      order: [["updated", "DESC"]],
    });

    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// ✅ GET /api/chats/:id — get a single chat by ID
router.get("/:id", async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id);

    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // Optionally populate user details
    const users = await User.findAll({
      where: { emplid: chat.users },
      attributes: ["emplid", "username", "email"],
    });

    res.json({ ...chat.toJSON(), participants: users });
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// ✅ POST /api/chats — create a new chat
router.post("/", async (req, res) => {
  try {
    const { name, is_group, created_by, users } = req.body;

    if (!users || users.length < 2 || !created_by) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify that the creator exists
    const creator = await User.findByPk(created_by);
    if (!creator) {
      return res.status(404).json({ error: "Creator user not found" });
    }

    const newChat = await Chat.create({
      name: name || null,
      is_group: !!is_group,
      created_by,
      users,
      messages: [], // start with no messages
    });

    res.status(201).json({
      message: "✅ Chat created successfully",
      chat: newChat,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
});

// ✅ POST /api/chats/:id/messages — add a message to a chat
router.post("/:id/messages", async (req, res) => {
  try {
    const { id } = req.params;
    const { sender_id, content } = req.body;

    if (!sender_id || !content) {
      return res.status(400).json({ error: "Missing sender_id or content" });
    }

    const chat = await Chat.findByPk(id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // Verify sender is in this chat
    if (!chat.users.includes(sender_id)) {
      return res.status(403).json({ error: "User not part of this chat" });
    }

    // Create and append the new message
    const newMessage = {
      sender_id,
      content,
      timestamp: new Date().toISOString(),
    };

    chat.messages = [...chat.messages, newMessage];
    await chat.save();

    res.status(201).json({
      message: "✅ Message added successfully",
      chat,
    });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ error: "Failed to add message" });
  }
});

// ✅ PUT /api/chats/:id — update chat info (e.g., name or users)
router.put("/:id", async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    const { name, users } = req.body;

    if (name !== undefined) chat.name = name;
    if (users !== undefined && Array.isArray(users)) chat.users = users;

    await chat.save();

    res.json({ message: "✅ Chat updated successfully", chat });
  } catch (error) {
    console.error("Error updating chat:", error);
    res.status(500).json({ error: "Failed to update chat" });
  }
});

// ✅ DELETE /api/chats/:id — delete a chat
router.delete("/:id", async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    await chat.destroy();
    res.json({ message: "🗑️ Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

module.exports = router;
