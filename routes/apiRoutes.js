//scrapping tools
var axios=require("axios");
var cheerio=require("cheerio");
//have express connect here
var express=require("express")
//express export routes
var router=express.Router();

//have mongoose models exported here so when we scrape we can also deal with the database
