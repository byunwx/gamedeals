// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();
app.use(express.static("public"));
// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

const scrapeFunction= (url)=>{
  db.scrapedData.drop();
const scrapeApage= (url)=>{
request(url, function(error, response, html) {
  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // Select each element in the HTML body from which you want information.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
  // but be sure to visit the package's npm page to see how it works
  $("li").each(function(i, element) {
    var img = $(element).children("div .img_container").children("a").children("img").attr("src");
    var link = "https://www.dealzon.com"+$(element).children("div .content_container").children("h2").children("a").attr("href");
    var title = $(element).children("div .content_container").children("h2").children("a").text();
    var price = parseFloat($(element).children("div .content_container").children("p").children("span.price").text().replace("$", ""));
    var section3= $(element).children("div .content_container").children("p").children("span.section_3").text().split("");
    if (img && link && title && price &&section3[0] !="EXPIRED") {
      db.scrapedData.insert({"title": title, "link":link, "price": price, "img":img});
    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link,
      price: price,
      img: img
    });
    }
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});
}
scrapeApage(url);
scrapeApage(url+"?page=2");
scrapeApage(url+"?page=3");
}

scrapeFunction("https://www.dealzon.com/gaming/ps4-games-sale");
app.get("/all", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  db.scrapedData.find({}, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});

app.get("/ps4", function(req, res){
  scrapeFunction("https://www.dealzon.com/gaming/ps4-games-sale");
  res.redirect("/");
})
app.get("/pc", function(req, res){
  scrapeFunction("https://www.dealzon.com/gaming/pc");
  res.redirect("/");
})
app.get("/xbox", function(req, res){
  scrapeFunction("https://www.dealzon.com/gaming/cheap-xbox-one-games");
  res.redirect("/");
})
// 3. At the "/name" path, display every entry in the animals collection, sorted by name
app.get("/title", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything,
  // but this time, sort it by name (1 means ascending order)
  db.scrapedData.find().sort({ title: 1 }, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});

// 4. At the "/weight" path, display every entry in the animals collection, sorted by weight
app.get("/price", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything,
  // but this time, sort it by weight (-1 means descending order)
  db.scrapedData.find().sort({ price: 1 }, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});
// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
