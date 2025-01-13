import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";


const toggleLikeOnVideo = asyncHandler(async(req,res)=>{
    try {
        const {videoId} = req.params
        console.log(videoId)
        const userLiking = req.user._id
        console.log(userLiking)
        if(!videoId){
            throw new ApiError(400,"provide a videoId")
        }
    
        const videoUserLike = await Like.findOne({
            likedBy:userLiking,
            video:videoId
        })

        console.log(videoUserLike)
    
        if(videoUserLike){
            await videoUserLike.deleteOne()
    
            return res
            .status(200)
            .json(new ApiResponse(200,videoUserLike,"Video unliked"))
        }
        else{
            const newLike = await Like.create({
                likedBy:userLiking,
                video:videoId
            })

            return res
            .status(200)
            .json(new ApiResponse(200,newLike,"Video Liked"))
        }
    } catch (error) {
        throw new ApiError(500,"There was some error",error)
    }
})

const toggleLikeOnTweets = asyncHandler(async(req,res)=>{
    try {
        const {tweetId} = req.params
        const userLiking = req.user._id
    
        if(!tweetId){
            throw new ApiError(400,"Please provide a tweet Id")
        }
    
        const tweetUserLike = await Like.findOne({
            likedBy:userLiking,
            tweet:tweetId
        })
    
        if(tweetUserLike){
            await tweetUserLike.deleteOne()
            return res
            .status(200)
            .json(new ApiResponse(200,tweetUserLike,"Tweet Unliked"))
        }
        else{
            const newLike = await Like.create({
                likedBy:userLiking,
                tweet:tweetId
            })

            return res
            .status(200)
            .json(new ApiResponse(200,newLike,"Tweet Liked"))
        }
    } catch (error) {
        throw new ApiError(500,"There was some error in catch",error)
    }
})

const toggleLikeOnComments = asyncHandler(async(req,res)=>{
    const {commentId} = req.params
    const userLiking = req.user._id
    if(!commentId){
        throw new ApiError(400,"Please provide a commentId")
    }
    const likeOnComment = await Like.findOne(
        {
            comment:commentId,
            likedBy:userLiking
        }
    )

    if(likeOnComment){
        await likeOnComment.deleteOne()
        return res
        .status(200)
        .json(new ApiResponse(200,likeOnComment,"comment unliked"))
    }
    else{
        const newLike = await Like.create({
            comment:commentId,
            likedBy:userLiking
        })
        return res
        .status(200)
        .json(new ApiResponse(200,newLike,"comment Liked"))
    }
})


export {toggleLikeOnVideo,toggleLikeOnTweets,toggleLikeOnComments}