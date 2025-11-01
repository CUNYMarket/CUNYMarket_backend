const express = require("express");
const router = express.Router();
const testDbRouter = require("./test-db");
const userRouter = require("./users");
const postRouter = require("./posts");
const chatRouter = require("./chat");

router.get("/", (req, res) => {
    res.json({ message: "API is working!"});
})

router.use("/users", userRouter);
router.use("/test-db", testDbRouter);
router.use("/posts", postRouter);
router.use("/chat", chatRouter);
module.exports = router;

