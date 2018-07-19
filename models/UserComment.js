var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// make the new Comment schema
var UserCommentSchema = new Schema({
    body: {
        type: String
    }
    // timeMade: {
    //     type: String,
    //     required: true
    // }
});

//create the modle from the above schema
var UserComment = mongoose.model("UserComment", UserCommentSchema);

module.exports = UserComment;