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
    for(let page=0; page<=7;page++){
    axios.get(`https://www.allrecipes.com/?page=${page}`).then(function(response){
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


    // console.log(result)
    console.log("******************")
    array.push(result)

    });

    //insert into the database
    db.Recipe.insertMany(array)
    .then(function(recipedb){
        
       
    })
    .catch(function(err){
        console.log(err)
        // res.send("oops something went wrong")
    });
   
    });
}
    res.redirect("/");
});
   
    //route to grab all the recipes we scraped

    router.get("/allrecipes", function(req,res){
        db.Recipe.find({ saved:false}).then(function(recipedb){
            console.log("from the find")
            console.log(recipedb)
            res.json(recipedb);
        })
        .catch(function(err){
            res.json(err);
        });
    });

    //route to save recipes it will a put because we are updating the bolean value on the save
    router.put("/saveRecipes/:id", function(req,res){
        db.Recipe.updateOne({_id:req.params.id}, {saved: true})
        .then(function(result){
            console.log(" it was saved")
            console.log(result)
            res.send("recipe saved")
        }).catch(function(err){
            console.log(err)
        });
    });

    //route to get user to see all their saved recipes
    router.get("/allsaved", function(req,res){
        db.Recipe.find({saved:true}).then(function(saved){
            console.log("All the saved ones")
            console.log(saved)
            res.json(saved)
        })
    })

     //route to get a specific recipe and it's notes
     router.get("/recipe/:id",function(req,res){
        db.Recipe.findOne({_id: req.params.id})
        //have all the associate notes be there too
        .populate("note")
        .then(function(recipedb){
            res.json(recipedb)
        })
        .catch(function(err){
            res.json (err)
            console.log(err)
        })
    })

    //route to allow user to create notes and be saved on the database as well as update it on the recipe collection
    router.post("/recipe/:id", function(req,res){
        db.Note.create(req.body)
        .then(function(Notedb){
            console.log(Notedb)
            return db.Recipe.findOneAndUpdate({_id:req.params.id},{$push:{note:Notedb._id}},{new: true});
        })
        .then(function(recipedb){
            console.log(recipedb)
            res.json(recipedb)
        })
        .catch(function(err){
            res.json(err)
        })
    })
    
   
    
   


module.exports=router;