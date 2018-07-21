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
    
        // res.send("scrape complete");
        // axios.get("https://www.nytimes.com").then(function(response) {
            
        //     var $ = cheerio.load(response.data);
    
        //     $('article').each(function(i, element) {
    
        //         let result = {};
    
        //         result.title = $(this).find('h2').text().trim();
        //         result.link = $(this).find('h2').children('a').attr('href');
        //         result.summary = $(this).find('.summary').text().trim();
    
        //         // TO DO - ADD VALIDATION BEFORE CREATING THE OBJECT
    
        //         if(result.title && result.link && result.summary) {
    
        //             Article.create(result, function(err) {
        //                 if(err) {
        //                     console.log("article already exists in db: " + result.title);
        //                 } else {
        //                     // console.log(dbArticle);
        //                     console.log("new article added to db: " + result.title);
        //                 }
        //             });     
        //         }
        //     });
        // });
    }); 
    
    app.get("/api/articles", function(req, res) {
        Article.find({})
            .populate("comment")
            .then(function(dbArticles) {
                res.json(dbArticles);
            }).catch(function(err) {    
                return console.log(err);
            });
    });
    
    app.get("/", function(req, res) {
        // retrieve all scraped articles from the db
        Article.find({})
            .populate("comment")
            .then(function(dbArticles) {
                res.render("home", {articles: dbArticles});
            }).catch(function(err) {
                res.json(err);
            });
    });
}