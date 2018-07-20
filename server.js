var express    = require("express");
    bodyParser = require("body-parser");
    handlebars = require("express-handlebars");
    cheerio    = require("cheerio");
    request    = require("request");
    mongoose   = require("mongoose");
    axios      = require("axios");

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

// Static directory
app.use(express.static("public"));

// Express-Handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/testscraper5");

var db = mongoose.connection;

// import the mongoose models
var Article = require("./models/Article");
var UserComment = require("./models/UserComment");
  
// Show any Mongoose errors
db.on('error', function(err) {
    console.log('Mongoose Error: ', err);
});
  
// Once logged in to the db through mongoose, log a success message
db.once('open', function() {
    console.log('Mongoose connection successful.');
});
  

//========================================
// FOR THE SCRAPE / ARTICLE ROUTES
//========================================

app.get("/scrape", function(req, res) {

    axios.get("https://www.nytimes.com").then(function(response) {
        
        var $ = cheerio.load(response.data);

        $('article').each(function(i, element) {

            let result = {};

            result.title = $(this).find('h2').text().trim();
            result.link = $(this).find('h2').children('a').attr('href');
            result.summary = $(this).find('.summary').text().trim();

            // TO DO - ADD VALIDATION BEFORE CREATING THE OBJECT

            if(result.title && result.link && result.summary) {
                Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                }).catch(function(err) {
                    console.log(err);
                });
            }
        });
        res.send("scrape complete!");
    });
}); 

app.get("/api/articles", function(req, res) {
    Article.find({})
        .then(function(dbArticles) {
            res.json(dbArticles);
        }).catch(function(err) {    
            return console.log(err);
        });
});

app.get("/", function(req, res) {
    // retrieve all scraped articles from the db
    Article.find({})
        .then(function(dbArticles) {
            // console.log(dbArticles.title);
            res.render("home", {articles: dbArticles});
        }).catch(function(err) {
            res.json(err);
        });
    // res.render("home", );
});

// ========================================
// FOR THE COMMENTS ROUTES
// ========================================

// POST route for adding comments to articles
app.post("/article/comment/create/:id", function(req, res) {

    UserComment.create(req.body)
        .then(function(dbUserComment) {
            return Article.findOneAndUpdate({_id: req.params.id}, { $push: {comment: dbUserComment._id } }, {new: true});
        }).then(function(dbArticle) {
            res.json(dbArticle);
        }).catch(function(err) {
            res.json(err);
        });
});

// GET route for displaying all comments from the database
app.get("/article/comment/:id", function(req, res) {
    Article.findOne({_id: req.params.id})
        .populate("comment")
        .then(function(data) {
            console.log(data);
            res.json(data);
        }).catch(function(err) {
            res.json(err);
        });
});

// Set the app to listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});