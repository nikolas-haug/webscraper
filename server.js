var express    = require("express");
    bodyParser = require("body-parser");
    handlebars = require("express-handlebars");
    cheerio    = require("cheerio");
    request    = require("request");
    mongoose   = require("mongoose");
    axios      = require("axios");
    moment     = require("moment");
    path       = require("path");
    methodOverride = require("method-override");

var app = express();

// TO DO - get the date format helper working

// register handlebars time format helpers
// hbsEngine = handlebars.create({
//     helpers: {
//         extname: 'handlebars',
//         defaultLayout: 'main',
//         formatDate: function (date, format) {
//             return moment(date).format(format);
//         }
//     }
// });

// app.set('views', path.join(__dirname, 'views'));
// app.engine('handlebars', hbsEngine.engine);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
// for method override on forms
app.use(methodOverride('_method'));

// Static directory
app.use(express.static("public"));

// Express-Handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/testscraper12";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/testscraper10");

var db = mongoose.connection;

// var scraper = require("./controllers/scraper");

// import the mongoose models
// var Article = require("./models/Article");
// var UserComment = require("./models/UserComment");
  
// Show any Mongoose errors
db.on('error', function(err) {
    console.log('Mongoose Error: ', err);
});
  
// Once logged in to the db through mongoose, log a success message
db.once('open', function() {
    console.log('Mongoose connection successful.');
});

// require ROUTES here
require("./routes/article-routes.js")(app);
require("./routes/comment-routes.js")(app);

// Set the app to listen on port 3000
app.listen(process.env.PORT || 3000, function() {
    console.log("App running on port 3000!");
});