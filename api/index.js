const express = require("express");
const router = express.Router();
const testDbRouter = require("./test-db");

router.get("/", (req, res) => {
    res.json({ message: "API is working!"});
})

router.use("/test-db", testDbRouter);
module.exports = router;
