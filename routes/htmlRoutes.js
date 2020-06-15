//have express connect here
var express=require("express")
//express export routes
var routes=express.Router();

routes.get("/", function(req,res){
     
    res.render("index")      

});


module.exports=routes;