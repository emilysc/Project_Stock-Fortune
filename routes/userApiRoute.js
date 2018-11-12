const router = require("express").Router();

router.get("/me", (req, res) => {
  console.log(req);
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(403).json({
      "error": "Please login."
    })
  }
});

router.use("/me/watch-list", require('./watchListApiRoute'));
module.exports = router;
