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

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  