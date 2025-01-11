import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Comment } from "../models/comments.model.js";
import {Video} from "../models/video.model.js"

const createComment = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const {content} = req.body
    const userMakingTheComment = req.user._id

    if(!videoId){
        throw new ApiError(400,"Please provide a videoId.You can only comment under videos")
    }

    const comment = await Comment.create({
        video:videoId,
        content:content,
        owner:userMakingTheComment
    })

    return res
    .status(200)
    .json(new ApiResponse(200,comment,"Commented successfully"))
})

const deleteComment = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,"Please provide your videoId where you have commented")
    }

    const comment = await Comment.findOne({
        video:videoId
    })

    if(!comment){
        throw new ApiError(400,"You haven't commented anything on this video")
    }

    if(comment.owner.toString()!=req.user._id){
        throw new ApiError(400,"You cannot delete someone else's comment")
    }

    await comment.deleteOne()
    return res
    .status(200)
    .json(new ApiResponse(200,comment,"Comment deleted successfully"))
})

const getAllCommentsOnAVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,"Please provide a videoId")
    }

    const getAllComments = await Video.aggregate([
        {
            $match:{_id:mongoose.Types.ObjectId(videoId)}
        },
        {
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignField:"video",
                as:"videoComments"
            }
        },
        {
            $addFields:{
                commentSize:{
                    $size:"$videoComments"
                }
            }
        },
        {
            $project:{
                videoFile:1,
                thumbnail:1,
                owner:1,
                title:1,
                description:1,
                videoComments:1,
                commentSize:1
            }
        }
    ])
    console.log(getAllComments)
    return res
    .status(200)
    .json(new ApiResponse(200,getAllComments[0],"comments fetched successfully"))
})

const updateComment = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const currentUser = req.user._id
    const {newContent} = req.body

    if(!videoId){
        throw new ApiError(400,"Please provide a videoId where you have commented")
    }

    if(!newContent || typeof newContent!=="string" || newContent.trim()===""){
        throw new ApiError(400,"Please provide a valid new comment for the new comment")
    }

    const updatedComment = await Comment.findOneAndUpdate(
        {
            video:videoId,
            owner:currentUser
        },
        {
            content:newContent
        }
    )

    if(!updatedComment){
        throw new ApiError(400,"There is no comment by you on this video")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updatedComment,"Comment updated successfully"))
})

export {createComment,deleteComment,getAllCommentsOnAVideo,updateComment}