import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {User} from "../models/user.model.js"
import {Subscription} from "../models/subscriptions.model.js"
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

const toggleSubscriptions = asyncHandler(async(req,res)=>{
    try {
        const {channelId} = req.params
        const subscriberId = req.user._id

        
        console.log(channelId)
        console.log(subscriberId)

        if(!channelId){
            throw new ApiError(400,"Please Provide a userId")
        }
        
        
        if(channelId == subscriberId.toString()){
            throw new ApiError(400,"You cannot subscribe to yourself")
        }
        
        const existingSubscription = await Subscription.findOne({
            channel:channelId,
            subscriber:subscriberId
        })
        console.log(existingSubscription)
    
        if(existingSubscription){
            await existingSubscription.deleteOne()
            return res
            .status(200)
            .json(new ApiResponse(200,existingSubscription,"Successfully unsubscribed"))
        }
        else{
            const newSubscription = await Subscription.create({
                channel:channelId,
                subscriber:subscriberId
            })
            return res
            .status(200)
            .json(new ApiResponse(200,newSubscription,"Successfully subscribed"))
        }
    } catch (error) {
        throw new ApiError(500,"An error occurred",error)
    }
})

const getAllChannelSubscribers = asyncHandler(async(req,res)=>{
    const {channelId} = req.params
    if(!channelId){
        throw new ApiError(400,"Please provide a channelId to fetch their subscribers")
    }

    const allSubscribers = await User.aggregate([
        {
            $match:{_id:new mongoose.Types.ObjectId(channelId)}
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"channelSubscribers"
            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$channelSubscribers"
                }
            }
        },
        {
            $project:{
                fullName:1,
                username:1,
                avatar:1,
                coverImage:1,
                channelSubscribers:1,
                subscribersCount:1
            }
        }
    ])
    console.log(allSubscribers)

    return res
    .status(200)
    .json(new ApiResponse(200,allSubscribers[0],"Subscribers fetched successfully"))
})

const getAllChannelSubscribedTo = asyncHandler(async(req,res)=>{
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400,"Please provide a channelId to fetch their subscribers")
    }

    const allChannelSubscription = await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"channelSubscribedTo"
            }
        },
        {
            $addFields:{
                channelsSubscribedToCount:{
                    $size:"$channelSubscribedTo"
                }
            }
        },
        {
            $project:{
                fullName:1,
                username:1,
                avatar:1,
                coverImage:1,
                channelSubscribedTo:1,
                channelsSubscribedToCount:1
            }
        }
    ])
    console.log(allChannelSubscription)
    return res
    .status(200)
    .json(new ApiResponse(200,allChannelSubscription[0],"User channels subscriptions fetched successfully"))
})

export {toggleSubscriptions,getAllChannelSubscribers,getAllChannelSubscribedTo}