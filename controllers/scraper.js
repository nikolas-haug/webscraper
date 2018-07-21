var axios      = require("axios");
    cheerio    = require("cheerio");

var Article = require("../models/Article.js");

function scraper() {

    // var scrapeCheck = "";

    axios.get("https://www.nytimes.com").then(function(response) {
        
        var $ = cheerio.load(response.data);

        $('article').each(function(i, element) {

            let result = {};

            result.title = $(this).find('h2').text().trim();
            result.link = $(this).find('h2').children('a').attr('href');
            result.summary = $(this).find('.summary').text().trim();

            // TO DO - RETURN TRUE OR FALSE IF THE DATA ALREADY EXISTS TO ALERT USER

            if(result.title && result.link && result.summary) {

                Article.create(result, function(err) {
                    if(err) {
                        console.log("article already exists in db: " + result.title);
                    } else {
                        // console.log(dbArticle);
                        console.log("new article added to db: " + result.title);
                    }
                });     
            }
        });
    });
    // return scrapeCheck;
}

module.exports = scraper;