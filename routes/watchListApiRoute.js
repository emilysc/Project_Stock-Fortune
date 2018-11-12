const router = require("express").Router();

const db = require("../models");


router.get("/:watchList", (req, res) => {
  if (!req.user) {
    res.status(403).json({
      "error": "Please login."
    });
  }
  console.log(db);

  db.WatchListItem.find({
    user: req.user,
    watchList: req.params.watchList
  })
    .sort({ _id: -1 })
    .then(function (dbWatchListItems) {
      res.json(dbWatchListItems);
    })
    .catch(function (err) {
      res.json(err);
    });
});

router.post("/:watchList", (req, res) => {
  if (!req.user) {
    res.status(403).json({
      "error": "Please login."
    });
  }
  console.log(req);
  if (req.params.watchList !== 'default') {
    res.status(400).json({
      "error": "invalid watch list name."
    });
  }

  db.WatchListItem.create({
    user: req.user,
    watchList: req.params.watchList,
    symbol: req.body.symbol
  })
    .then(function (dbWatchListitem) {
      res.json(dbWatchListitem);
    })
    .catch(function (err) {
      res.json(err);
    })
});

router.delete("/:watchList/:symbol", function (req, res) {
  if (!req.user) {
    res.status(403).json({
      "error": "Please login."
    });
  }

  db.WatchListItem.deleteOne({
    user: req.user,
    watchList: req.params.watchList,
    symbol: req.params.symbol
  }, function (err) {
    if (err) return handleError(err);
    res.send("deleted");
  });
});

module.exports = router;
