$(document).ready(function(){

    //get the route with all recipes to show up in the index by dynamically creating
    //their place in the index.handlebars

$.get("/allrecipes",function(response){
    console.log(response.length)
    // if(response.length ===0){
    //     $("#noRecipes").show();
    // }
    for(var i=0; i<response.length;i++){
        $(".recipes").append(`
        <div class = "col-md-4" data-id=${response[i]._id}">
        <div class= "card recipeCard style= "width: 18rem;>
        <img src="${response[i].image}" class="recipeImage alt="Recipe Image">
        <div class="card-body>
        <h5 class="card-title">${response[i].title}</h5>
        <p class="card-text">${response[i].description}</p>
        <a href="${response[i].link} target="_blank" class="btn btn-primary">Go to Recipe</a>
        </div>
        </div>
        `)
    } 
    //location.href="/"
});



});