import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {User} from "../models/user.model.js"
import {Subscription} from "../models/subscriptions.model.js"
import { ApiResponse } from "../utils/apiResponse.js";

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

export {toggleSubscriptions}