var express =require("express");
var mongoose= require("mongoose");

//Port where are server can be hosted
var PORT=process.env.PORT || 8080;

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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/recipeBookdb";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true ,useCreateIndex: true, useUnifiedTopology: true})


//import routes and give the server access to them.
var routes=require("./routes/htmlRoutes.js");
app.use(routes);

var router=require("./routes/apiRoutes.js");
app.use(router);

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!"+ " ...Click on the link: " +"http://localhost:8080/");
  });
  