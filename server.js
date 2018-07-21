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
mongoose.connect("mongodb://localhost/testscraper7");

var db = mongoose.connection;

var scraper = require("./controllers/scraper");

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

// require ROUTES here
require("./routes/article-routes")(app);
require("./routes/comment-routes")(app);

// Set the app to listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});