// server/routes/users.js
const express = require("express");
const { jointrip } = require("../db/join_db");
const router = express.Router();
const { User } = require("../models");

// POST /api/users/jointrip - 유저가 여행 참가
router.post("/", async (req, res, next) => {
  const { tripId, userId } = req.body;
  console.log("tripId", tripId, "userId", userId);
  try {
    const result = await jointrip(userId, tripId);
    return res.status(200).json({ success: true, message: result });
  } catch (e) {
    console.error(e);
    console.log("e", e);
    return res.status(400).json({ success: false, message: e });
  }
});
module.exports = router;
