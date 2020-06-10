//scrapping tools
var axios=require("axios");
var cheerio=require("cheerio");
//have express connect here
var express=require("express")
//express export routes
var router=express.Router();

//have mongoose models exported here so when we scrape we can also deal with the database
var db=require("../models");

router.get("/scrape",function(req,res){
    axios.get("https://www.allrecipes.com").then(function(response){
        //loading body of html onto cherio after requesting it with axios
        var $=cheerio.load(response.data);

        
    })
})