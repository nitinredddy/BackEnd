import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    comments:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comments"
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    tweet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tweet"
    }
},{timestamps:true})

export const Like = mongoose.model("Like",likeSchema)