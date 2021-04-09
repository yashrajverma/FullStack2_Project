const mongoose = require('mongoose');

const {ObjectID}=mongoose.Schema.Types
const postSchema=new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    body:{
        required:true,
        type:String
    },
    photo:{
        required:true,
        type:String
    },
    likes:[{ref:"User",type:ObjectID}],
    comments:[{text:String,
        postedBy:{ref:"User",type:ObjectID}
    }],
    postedBy:{
        ref:"User",
        type:ObjectID
    }
})
mongoose.model("post",postSchema)