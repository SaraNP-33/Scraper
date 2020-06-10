var express =require("express");
var mongoose= require("mongoose");

//Port where are server can be hosted
var PORT=process.env.PORT || 3000;

//Initialize express
var app=express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/recipeBookdb", { useNewUrlParser: true });

//import routes and give the server access to them.

var router=require("./routes/apiRoutes.js");
app.use(router);

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  