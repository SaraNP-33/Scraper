var mongoose=require("mongoose");

var Schema=mongoose.Schema;

//using Schema constructor to create a new UserSchema object

var RecipeSchema =new Schema({
    title:{
        type: String,
        require:true
    },

    link:{
        type: String,
        require: true,
        unique: true
    },
    image:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true,
       
    },
    saved:{
        type:Boolean,
        default: false
    },
    note:{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Recipe = mongoose.model("Recipe", RecipeSchema);

module.exports=Recipe;