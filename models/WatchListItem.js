var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var WatchListItemSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Person',
        required: true
    },
    watchList: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true,
    }
});
WatchListItemSchema.index({ user: 1, watchList: 1, symbol: 1 }, { unique: true });

var WatchListItem = mongoose.model("watchListItem", WatchListItemSchema);

module.exports = WatchListItem;