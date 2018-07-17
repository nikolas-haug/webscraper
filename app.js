var express    = require("express");
    bodyParser = require("body-parser");
    handlebars = require("express-handlebars");
    cheerio    = require("cheerio");
    request    = require("request");
    mongoose   = require("mongoose");

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

// Static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/webscraper");

//========================================
// routes
//========================================

app.get("/", function(req, res) {

    // Save an empty result object
    var result = {};

    request("https://www.nytimes.com/", function(err, response, html) {
        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        

        $('article').each(function(i, element) {
            
            result.title = $(this).find('h2').text();

            result.link = $(this).find('h2').children('a').attr('href');

            result.summary = $(this).find('.summary').text();
            // result.title = $(this).children('a').text();

            // result.link = $(this).children('a').attr('href');

            // result.byline = $(this).children('p').find('.byline').text();

            // result.summary = $(this).children('.summary').text();

            // Add the text and href of every link, and save them as properties of the result object
            // result.title = $(this)
            // .children("a")
            // .text();
            // result.link = $(this)
            // .children("a")
            // .attr("href");

            console.log("=================================")
            console.log(result.summary);

        });
        
    });

});
















// Set the app to listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});