var express    = require("express");
    bodyParser = require("body-parser");
    handlebars = require("express-handlebars");
    cheerio    = require("cheerio");
    request    = require("request");
    mongoose   = require("mongoose");
    axios      = require("axios");

var Article = require("../models/Article");
var UserComment = require("../models/UserComment");

// ========================================
// FOR THE COMMENTS ROUTES
// ========================================

module.exports = function(app) {

    // POST route for adding comments to articles
    app.post("/article/comment/create/:id", function(req, res) {

        UserComment.create(req.body)
            .then(function(dbUserComment) {
                return Article.findOneAndUpdate({_id: req.params.id}, { $push: {comment: dbUserComment._id } }, {new: true});
            }).then(function(dbArticle) {
                // res.json(dbArticle);
                res.redirect("/");
            }).catch(function(err) {
                res.json(err);
            });
    });
}