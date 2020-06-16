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
        alert("Recipe saved! Go to Saved Recipes to add your notes")
    });
});

//this get will allow the user to go see all their saved recipes

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
        <button type="button" id="addNote" class="btn btn-success ml-2" data-toggle="modal" data-target="#result-modal"  data-id=${response[i]._id}>Notes</button>
        </div>
        </div>
        </div>
        `)
    } 

});
//event to allow user to see the notes if there are any
$(document).on("click", "#addNote", function(){
    console.log("click")
var id=$(this).data("id")
$(".notes").empty();
$.ajax({
    url:"/recipe/" + id,
    method:"GET"
}).then(function(data){
    console.log(data)
   $(".notes").append(`
        <div class=modal-header">
        <h5 class="modal-title">${data.title}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-lable="Close">
        <span aria-hidden="true">&times;</span> </button>
        </div>
        <div class="modal-body">
        <form>
        <div class="form-group">
        <label for="name" class="col-form-label">Note Title:</label>
        <input type="text" class="form-control" id="noteTitle">
        </div>
        <div class="form-group">
        <label for="text" class="col-form-label">Note:</label>
        <textarea class="form-control" id="noteBody"></textarea>
        </div>
        </form>
        <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-id=${data._id} data-dismissal="modal">Delete Note</button>
        <button type="button" class="btn btn-success saveNote" data-id=${data._id}>Save Note</button>
        </div>
        </div>
   `)
    if(data.note){
        console.log("this is the note info")
        console.log(data.note.body)
        $("#noteTitle").val(data.note.title);
        $("#noteBody").val(data.note.body)
    }
});

});
//add a the note when opne the modal
$(document).on("click",".saveNote", function(){
    var id=$(this).data("id");
    $.ajax({
        url:"/recipe/" +id,
        method:"Post",
        data:{
            title: $("#noteTitle").val(),
            body:$("#noteBody").val()
        }
    }).then(function(data){
        console.log(data)
    })
    $("#note.Title").val(),
    $("#noteBody").val()
})
// button that allows user to delete all scrape items so they can scrape again if they so choose. 


});