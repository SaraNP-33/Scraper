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
            // console.log(response.data)
            console.log("dragon")
    var array=[];
    //grabbing the individual recipe cards
    $("article.fixed-recipe-card").each(function(i,element){

    //empty object to put everything I want from those cards
        var result={}
    
    //adding to the object the specific things to scrape from those cards
    result.image =$(this)
    .find("img.fixed-recipe-card__img")
    .attr("data-original-src")
   
    
    result.title=$(this)
    .find("span.fixed-recipe-card__title-link")
    .text()

    result.link=$(this)
    .find("a.fixed-recipe-card__title-link")
    .attr("href")

    result.description=$(this)
    .find("div.fixed-recipe-card__description")
    .text()


    console.log(result)
    console.log("******************")
    array.push(result)

    });

    //insert into the database
    db.Recipe.insertMany(array)
    .then(function(recipedb){
        console.log(recipedb)
        res.send("scrape Complete")
    })
    .catch(function(err){
        console.log(err)
        res.send("oops something went wrong")
    });
   
    });
    
   
});

module.exports=router;