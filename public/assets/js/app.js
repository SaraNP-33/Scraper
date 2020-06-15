$(document).ready(function(){

    //get the route with all recipes to show up in the index by dynamically creating
    //their place in the index.handlebars

$.get("/allrecipes",function(response){
    console.log(response.length)
    for(var i=0; i<response.length;i++){
        $(".recipes").append(`
        <div class = "col-md-4 " data-id=${response[i]._id}">
        <div class= "card recipeCard style= "width: 18rem;>
        <img src="${response[i].image}" class="recipeImage alt="Recipe Image">
        <div class="card-body">
        <h4 class="card-title"><strong>${response[i].title}</strong></h4>
        <p class="card-text">${response[i].description}</p>
        <div class="row button d-flex justify-content-center">
        <a href="${response[i].link}" target="_blank" class="btn btn-primary">Go to Recipe</a>
        <button type="button" id="saveBtn" class="btn btn-success ml-2" data-id=${response[i]._id}> Save Recipe</button>
        </div>
        </div>
        </div>
        `)
    } 
  
});
// when click on the button to save this will update the database 
$(document).on("click","#saveBtn", function(){
    var id= $(this).data("id")
    console.log(id)
    $.ajax({
        url:"/saveRecipes/" + id,
        method:"PUT"
    }).then(function(result){
        $("#recipeId").find(`[data-id=${id}]`).hide();
        alert("Recipe saved! Go to Saved Recipes to add your notes")
    });
});

//this event will allow the user to go see all their saved recipes

$.get("/allsaved", function(response){
    for(var i=0; i<response.length;i++){
        $(".savedRecipes").append(`
        <div class = "col-md-4 recipeId" data-id=${response[i]._id}">
        <div class= "card recipeCard style= "width: 18rem;>
        <img src="${response[i].image}" class="recipeImage alt="Recipe Image">
        <div class="card-body">
        <h4 class="card-title"><strong>${response[i].title}</strong></h4>
        <p class="card-text">${response[i].description}</p>
        <div class="row button d-flex justify-content-center">
        <a href="${response[i].link}" target="_blank" class="btn btn-primary">Go to Recipe</a>
        <button type="button" id="saveBtn" class="btn btn-success ml-2"> Add Note</button>
        </div>
        </div>
        </div>
        `)
    } 

})



});