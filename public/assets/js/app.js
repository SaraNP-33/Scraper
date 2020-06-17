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
    console.log(response)
    for(var i=0; i<response.length;i++){
        $(".savedRecipes").append(`
        <div class = "col-md-4 recipeId d-flex flex-column" data-id=${response[i]._id}">
        <div class= "card recipeCard mb-3" style="width:20vw; height:70vh">
        <img src="${response[i].image}" class="recipeImage alt="Recipe Image">
        <div class="card-body">
        <h5 class="card-title"><strong>${response[i].title}</strong></h5>
        <p class="card-text">${response[i].description}</p>
        <div class="button align-items-end mb-0">
        <a href="${response[i].link}" target="_blank" class="btn btn-primary">Go to Recipe</a>
        <button type="button" class="btn btn-success ml-2 addNote" data-toggle="modal" data-target="#result-modal"  data-id=${response[i]._id}>Notes</button>
        </div>
        </div>
        </div>
        </div>
        `)
    } 

});
//event to allow user to see the notes if there are any
$(document).on("click", ".addNote", function(){
    console.log("click")

var id=$(this).data("id")
console.log("this is the article id:"+id)

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
        
        <button type="button" class="btn btn-success saveNote" data-id=${data._id}>Save Note</button>
        </div>
        </div>
   `)
    if(data.note){
        $(".modal-footer").append(`
        <button type="button" class="btn btn-secondary deleteNote" data-id=${data.note._id} data-dismissal="modal">Delete Note</button>
        `)
        console.log("this is the note info")
        console.log(data.note.body)
        $("#noteTitle").val(data.note.title);
        $("#noteBody").val(data.note.body)
    }
});

});
//add a note and save it 
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
        console.log("saved the note")
       console.log(data)
    })
    $("#noteTitle").val("")
    $("#noteBody").val("")
})

//delete a note

$(document).on("click",".deleteNote", function(){
 
       var id=$(this).data("id");
    
     
    console.log("the info from the button")
    console.log(id)
    $.ajax({
        url:"/deleteNote/" +id,
        method: "DELETE"
       
    }).then(function(){
        console.log("it's running")
        $("#noteTitle").val(" ")
        $("#noteBody").val(" ")

    }).fail(function(err){
        console.log(err)
    })
})


});