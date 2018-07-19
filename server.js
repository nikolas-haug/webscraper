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
mongoose.connect("mongodb://localhost/testscraper4");

// Database Configuration with Mongoose
// ---------------------------------------------------------------------------------------------------------------
// Connect to localhost if not a production environment
// if(process.env.NODE_ENV == 'production'){
//     mongoose.connect('mongodb://heroku_60zpcwg0:ubn0n27pi2856flqoedo9glvh8@ds119578.mlab.com:19578/heroku_60zpcwg0');
//   }
//   else{

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
            // result.title = title;
            // result.link = link;
            // result.summary = summary;

            
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
            res.render("home", {articles: dbArticles});
        }).catch(function(err) {
            res.json(err);
        });
    // res.render("home", );
});

// ========================================
// FOR THE COMMENTS ROUTES
// ========================================

// app.post("/comment/add", function(req, res) {
//     UserComment.create(req.body.body)
//         .then(function(dbUserComment) {
//             console.log(dbUserComment);
//         }).catch(function(err) {
//             res.json(err);
//         });
// });

// POST route for adding comments to articles
app.post("/article/comment/create/:id", function(req, res) {

    UserComment.create(req.body)
        .then(function(dbUserComment) {
            return Article.findOneAndUpdate({_id: req.params.id}, {comment: dbUserComment._id}, {new: true});
        }).then(function(dbArticle) {
            res.json(dbArticle);
        }).catch(function(err) {
            res.json(err);
        });
});

// GET route for displaying all comments from the database
app.get("/aricle/comment/:id", function(req, res) {
    
});


// Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//     // TODO
//     // ====
//     // save the new note that gets posted to the Notes collection
//     // then find an article from the req.params.id
//     // and update it's "note" property with the _id of the new note
//     db.Note.create(req.body)
//       .then(function(dbNote) {
//         return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id }, { new: true});
//       })
//       .then(function(dbArticle) {
//         res.json(dbArticle);
//       }).catch(function(err) {
//         res.json(err);
//       });
//   });


// Set the app to listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});