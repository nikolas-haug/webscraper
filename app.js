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


    request("https://www.nytimes.com/", function(err, response, html) {
        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // Save an empty result array
        var results = [];        

        $('article').each(function(i, element) {
            
            var title = $(this).find('h2').text().trim();

            var link = $(this).find('h2').children('a').attr('href');

            var summary = $(this).find('.summary').text().trim();

            if(title && summary) {
                results.push({
                    title: title,
                    link: link,
                    summary: summary
                });
            }
            
        });
        console.log("=================================")
        console.log(results);
        res.json(results);
    });
    // res.send(JSON.stringify(result)); 
});



// Set the app to listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});