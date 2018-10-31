var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    url: {
        type: String,
        required: true,
        unique: true
    }
});

var Article = mongoose.model("articles", ArticleSchema);

// Export the Article model
module.exports = Article;