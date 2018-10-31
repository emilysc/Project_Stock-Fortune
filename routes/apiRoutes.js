const axios = require("axios");
const router = require("express").Router();

const db = require("../models");

router.get("/recipes", (req, res) => {
  axios
    .get("http://www.recipepuppy.com/api/", { params: req.query })
    .then(({ data: { results } }) => res.json(results))
    .catch(err => res.status(422).json(err));
});

// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .sort({ date: -1 })
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.post("/articles", function (req, res) {
  db.Article.create(req.body)
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.delete("/articles/:id", function (req, res) {
  db.Article.deleteOne({ _id: req.params.id }, function (err) {
    if (err) return handleError(err);
    // deleted at most one document
    res.send("deleted");
  });
});

router.use("/users", require('./userApiRoute'));
module.exports = router;
