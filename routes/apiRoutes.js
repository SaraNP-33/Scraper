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
    // for(let page=0; page<=7;page++){
    axios.get(`https://www.allrecipes.com/`).then(function(response){
        //loading body of html onto cherio after requesting it with axios
        var $=cheerio.load(response.data);
            console.log(response.data, "data")
            //console.log("dragon")
    var array=[];
    //grabbing the individual recipe cards
    $("div.component.card.card_category").each(function(i,element){

    //empty object to put everything I want from those cards
        var result={}
    
    //adding to the object the specific things to scrape from those cards
    result.image = $(element)
    .find("img.component.lazy-image")
    .attr("data-src")
   
    
    result.title=$(element)
    .find("h3.card__title")
    .text()

    result.link=$(element)
    .find("a.card__titleLink")
    .attr("href")

    result.description=$(element)
    .find("div.card__summary")
    .text()


    console.log(result, "am I getting it?")
    console.log("******************")
    array.push(result)

    });
    console.log(array)

    //insert into the database
    db.Recipe.insertMany(array)
    .then(function(recipedb){
        console.log(recipedb)
       
    })
    .catch(function(err){
        console.log(err)
        // res.send("oops something went wrong")
    });
   
    }).catch((err)=>{
        console.log(err, "err from scraping")
    })
// }
    res.redirect("/");
});
   
    //route to grab all the recipes we scraped

    router.get("/allrecipes", function(req,res){
        db.Recipe.find({ saved:false}).then(function(recipedb){
            // console.log("from the find")
            // console.log(recipedb)
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
            // console.log(" it was saved")
            // console.log(result)
            res.send("recipe saved")
        }).catch(function(err){
            console.log(err)
        });
    });

    //route to get user to see all their saved recipes
    router.get("/allsaved", function(req,res){
        db.Recipe.find({saved:true}).then(function(saved){
            // console.log("All the saved ones")
            // console.log(saved)
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
            return db.Recipe.findOneAndUpdate({_id:req.params.id},{$set:{note:Notedb._id}},{new: true});
        })
        .then(function(recipedb){
            console.log(recipedb)
            res.json(recipedb)
        })
        .catch(function(err){
            res.json(err)
        })
    })
    
   //*****************DELETE ROUTES****************************** */

   //route that allows to delete all the scrape recipes saved in database that are not saved
   //this is a get because I am using the route directly on a button as a link

   router.get("/deleteAll", function(req,res){
       db.Recipe.deleteMany({saved:false})
       .then(function(){
           res.render("index")
       });
   });

//route to delete one article in the saved true category
router.delete("/deleteOne/:id", function(req,res){
    db.Recipe.deleteOne({_id:req.params.id}, {saved:true})
    .then(function(recipedb){
        console.log(recipedb)
        res.render("saved")
    });
});

//route to delete a note
router.delete("/deleteNote/:id", function(req,res){
    console.log("unicorn")
    db.Note.deleteOne({_id:req.params.id})
    .then(Notedb=>{
        console.log("was note deleted?")
        console.log(Notedb)
        return db.Recipe.updateOne({_id:req.params.id},{$pullAll:{notes:Notedb._id}})
    }).then(recipeDb=>{
        console.log("it was deleted")
        console.log(recipeDb)
        res.send(true)
    })
    .catch(err=>{
        console.log(err)
    });
});
   


module.exports=router;