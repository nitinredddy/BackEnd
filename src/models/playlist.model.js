import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    description:{
        type:String,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    videos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    title:{
        type:String,
        required:true
    }


},{timestamps:true})



export const Playlist = mongoose.model("Playlist",playlistSchema)