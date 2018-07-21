var express    = require("express");
    bodyParser = require("body-parser");
    handlebars = require("express-handlebars");
    cheerio    = require("cheerio");
    request    = require("request");
    mongoose   = require("mongoose");
    axios      = require("axios");

var Article = require("../models/Article");
var scraper = require("../controllers/scraper");

//========================================
// FOR THE SCRAPE / ARTICLE ROUTES
//========================================
module.exports = function(app) {

    // GET route for the scraped articles - using scraper controller
    app.get("/scrape", function(req, res) {

        scraper();
    
        res.redirect("/");
    }); 
    
    // GET api route for all articles in the db
    app.get("/api/articles", function(req, res) {
        Article.find({})
            .populate("comment")
            .then(function(dbArticles) {
                res.json(dbArticles);
            }).catch(function(err) {    
                return console.log(err);
            });
    });
    
    // GET route to retrieve all scraped articles from the db with their populated comments rendered to page
    app.get("/", function(req, res) {
        Article.find({})
            .populate("comment")
            .then(function(dbArticles) {
                res.render("home", {articles: dbArticles});
            }).catch(function(err) {
                res.json(err);
            });
    });
}