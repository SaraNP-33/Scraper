

$(document).ready(function () {

    //get the route with all recipes to show up in the index by dynamically creating
    //their place in the index.handlebars

    $.get("/allrecipes", function (response) {
        // console.log(response)
        for (var i = 0; i < response.length; i++) {
            console.log(response.length)
            $("#recipes").append(`
            <div class="tile is-parent parent">
                <article class="tile is-block is-child box">
                    <div class = "content" data-id="${response[i]._id}">
                        <figure class="image is-block">
                            <img src="${response[i].image}" class="recipeImage" alt="Recipe Image">
                        </figure>
                    </div>
                    <hr>
                    <a href="${response[i].link}" target="_blank">
                    <h5 class="card-title"><strong>${response[i].title}</strong></h5>
                    </a>
                    <div class="content pt-3"  id="description">
                        <p>${response[i].description}</p>
                    </div>
                    <hr>
                    <div class="content is-flex is-justify-content-space-around has-text-centered is-block is-align-self-flex-end">
                    <a id="viewLink" href ="${response[i].link}" target="_blank">
                    View Recipe
                    </a>
                    <span id="saveBtn" class="fa-layers fa-fw" data-id="${response[i]._id}"><i class="fas fa-heart fa-2x"></i>
                    <span id="save" class="fa-layers-text fa-inverse" data-fa-transform="shrink-7" style="font-weight:400"> SAVE </span>
                    </span>
                </div>
                </article>
            </div>
        `)
        };
    });

    // when click on the button to save this will update the database 
    $(document).on("click", "#saveBtn", function () {
        var id = $(this).data("id")
        console.log(id)
        $.ajax({
            url: "/saveRecipes/" + id,
            method: "PUT"
        }).then(function (result) {
            alert("Recipe saved! Go to Saved Recipes to add your notes")
        });
    });

    //this get will allow the user to go see all their saved recipes

    $.get("/allsaved", function (response) {
        console.log(response)
        for (var i = 0; i < response.length; i++) {
            $("#savedRecipes").append(`
            <div class="tile is-parent is-vertical parent">
                <article class="tile is-block is-child box is-align-content-space-between">
                    <div class = "content" data-id="${response[i]._id}">
                        <figure class="image is-block">
                            <img src="${response[i].image}" class="recipeImage" alt="Recipe Image">
                        </figure>
                    </div>
                    <hr>
                    <div class="card-body">
                        <a href ="${response[i].link}" target="_blank">
                            <h5 class="card-title"><strong>${response[i].title}</strong></h5>
                        </a>
                        <div class="content pt-3" id="description">
                            <p class="">${response[i].description}</p>
                        </div>
                        <hr>
                        <div class="content is-flex is-justify-content-space-around has-text-centered">
                            <a class="ml-2 delSaved" data-id="${response[i]._id}"><i class="fa fa-trash fa-1x" aria-hidden="true"></i></a>
                            <a id="viewLink" href ="${response[i].link}" target="_blank">
                            View Recipe
                            </a>
                            <a id="addNote" data-toggle="modal" data-target="result-modal" data-id="${response[i]._id}">NOTES</a>
                        </div>
                    </div>
                </article>
            </div>
        `)
        }

    });


    //event to allow user to see the notes if there are any
    $(document).on("click", "#addNote", function () {
        console.log("click")

        // OPEN THE MODAL 
        $("#result-modal").addClass("is-active");

        var id = $(this).data("id")
        console.log("this is the article id:" + id)

        $("#notes").empty();

        $.ajax({
            url: "/recipe/" + id,
            method: "GET"
        }).then(function (data) {
            console.log(data, "from data")
            $("#notes").append(`
                <div class="modal-card">
                    <section class="modal-card-body">
                        <div class="is-flex is-flex-direction-row-reverse">
                            <button  id="x" class="delete mr-5 mb-5" aria-label="close"></button>
                        </div>
                        <div class="content has-text-centered">
                        <a  href="${data.link}" target="_blank" class=" is-centered title modal-card-title has-text-link mb-5 mx-auto " id="modal-title">${data.title}</a>
                        <figure class="image">
                            <img src="${data.image}" class="recipeImage" alt="Recipe Image" id="modalImg">
                        </figure>
                        <form class="content mt-5 has-text-centered">
                            <div class="form-group">
                                <input type="text" placeholder="TITLE OF NOTE" class="form-control" id="noteTitle">
                            </div>
                            <div class="form-group">
                                <textarea class="form-control mt-3 pt-2" placeholder="ENTER NOTE HERE" id="noteBody"></textarea>
                            </div>
                        </form>
                        <div class="content-notes">
                        <h3 class="is-link"> Notes</h3>
                        <hr>
                        </div>
                        </div>
                    </section>
                    <hr>
                    <div class="is-flex is-flex-direction-row-reverse mr-5">
                        <button class="button is-success saveNote mr-5" data-id=${data._id}>Save Note</button>
                    </div>
                </div>
            `)
            // appending Notes on the bottom of Modal
             data.note.forEach(function(e){
                
                const ul=$("<ul>")
                const li= $(`<li>${e.title} - ${e.body}</li>`)
                ul.append(li)
                console.log(li)
                $(".content-notes").append(ul)
                
             })
                
                
                
            }
        );

    });

    //Close modal by clicking out of it
    $(".modal-background").click(() => {
        $(".modal").removeClass("is-active");
    })

    //Close modal by clicking the x button
    $(document).on("click","#x",() => {
        $(".modal").removeClass("is-active");
        console.log("Did the modal close?") // NOPE
    })

    //add a note and save it 
    $(document).on("click", ".saveNote", function () {
        console.log("clicked notes")
        var id = $(this).data("id");
        $.ajax({
            url: "/recipe/" + id,
            method: "POST",
            data: {
                title: $("#noteTitle").val(),
                body: $("#noteBody").val()
            }
        }).then(function (data) {
            console.log("saved the note")
            console.log(data)
        })
        $("#noteTitle").val("")
        $("#noteBody").val("")
    })

    //delete a note

    $(document).on("click", ".deleteNote", function () {

        var id = $(this).data("id");


        console.log("the info from the button")
        console.log(id)
        $.ajax({
            url: "/deleteNote/" + id,
            method: "DELETE"

        }).then(function () {
            console.log("it's running")
            $("#noteTitle").val(" ")
            $("#noteBody").val(" ")

        }).fail(function (err) {
            console.log(err)
        })
    })

    //delete a saved recipe
    $(document).on("click", ".delSaved", function () {
        var id = $(this).data("id")
        $.ajax({
            url: "/deleteOne/" + id,
            method: "DELETE"
        }).then(function () {
            console.log("it has been deleted")
            location.reload();
        })
    })


});


 // $(".modal-footer").append(`
                //     <button type="button" class="btn btn-secondary deleteNote" data-id=${data.note._id} data-dismissal="modal">Delete Note</button>
                // // `)
                // console.log("this is the note info") 
              
                
            //    $("#noteTitle").val(data.note.title)
            //   $("#noteBody").val( data.note.body)