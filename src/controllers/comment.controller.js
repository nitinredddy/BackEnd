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
    const {commentId} = req.params
    if(!commentId){
        throw new ApiError(400,"Please provide your commentId")
    }

    const comment = await Comment.findOne({
        _id:commentId
    })

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
    const {commentId} = req.params
    const currentUser = req.user._id
    const {newContent} = req.body

    if(!commentId){
        throw new ApiError(400,"Please provide a commentId")
    }

    const getComment = await Comment.findOne({
        _id:commentId
    })
    if(!getComment){
        throw new ApiError(400,"There was some error while finding the comment")
    }

    if(getComment.owner.toString()!=currentUser){
        throw new ApiError(400,"You can only change comments made by yourself")
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId,{
        content:newContent
    })

    if(!updatedComment){
        throw new ApiError(400,"There was some error while updating the comment")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updatedComment,"Comment updated successfully"))
})

export {createComment,deleteComment,getAllCommentsOnAVideo,updateComment}