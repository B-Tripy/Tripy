// server/routes/users.js
const express = require("express");

const { jointrip } = require("../db/join_db");

const router = express.Router();

const { User } = require("../models");

// POST /api/users/login - 로그인
router.post("/", (req, res, next) => {
  const { tripId, userId } = req.body;
  console.log("tripId", tripId, "userId", userId);
  jointrip(userId, tripId);
  try {
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e.message });
  }
});
module.exports = router;
