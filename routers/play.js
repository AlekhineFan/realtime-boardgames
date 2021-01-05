const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.sendFile("play.html", { root: "./public" });
});

module.exports = router;
