import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js"
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/apiError.js";

const publishATweet = asyncHandler(async(req,res)=>{
    const {tweetContent} = req.body

    if(!tweetContent){
        throw new ApiError(400,"Content is required before publishing")
    }

    const tweet = await Tweet.create({
        content:tweetContent,
        owner:req.user._id
    })

    if(!tweet){
        throw new ApiError(500,"There was a problem in publishing the tweet")
    }

    console.log("Tweet uploaded successfully")

    return res
    .status(200)
    .json(new ApiResponse(200,tweet,"Tweet uploaded successfully"))
})

const updateTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params
    
    if(!tweetId){
        throw new ApiError(400,"Please provide a Tweet Id")
    }
    
    const {updatedTweetContent} = req.body
    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,{
        content:updatedTweetContent
    })

    if(!updateTweet){
        throw new ApiError(500,"There was an error while updating the tweet")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updatedTweet,"Tweet Updated Successfully"))
})

const deleteTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params

    if(!tweetId){
        throw new ApiError(400,"Please provide a Tweet Id")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if(!deletedTweet){
        throw new ApiError(400,"Tweet ID does not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,deletedTweet,"Tweet deleted successfully"))
})

const getAllTweets = asyncHandler(async(req,res)=>{
    const {username} = req.params

    if(!username.trim()){
        throw new ApiError(400,"Please provide a tweetId")
    }

    const userTweets = await User.aggregate([
        {
            $match:{
                username:username.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"tweets",
                localField:"_id",
                foreignField:"owner",
                as:"userTweets"
            }
        },
        {
            $project:{
                userTweets:1,
                username:1,
                avatar:1,
            }
        }
    ])
    console.log(userTweets)

    if(!userTweets?.length){
        throw new ApiError(404,"userTweets do not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,userTweets[0],"User tweets fetched successfully"))
})

export {publishATweet,updateTweet,deleteTweet,getAllTweets}