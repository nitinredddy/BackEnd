import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

const channelDashboard = asyncHandler(async(req,res)=>{
    const {channelName} = req.params

    if(!channelName.trim()){
        throw new ApiError(400,"Please provide the channel name to go to their dashboard")
    }

    const channel = await User.aggregate([
        {
            $match:{
                username:channelName.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            } 
        },
        {
            $lookup:{
                from:"videos",
                localField:"_id",
                foreignField:"owner",
                as:"ownerVideos"
            }
        },
        {
            $lookup:{
                from:"playlists",
                localField:"_id",
                foreignField:"owner",
                as:"ownerPlaylists"
            }
        },
        {
            $addFields:{
                subscriberCount:{$size:"$subscribers"},
                subscribedToCount:{$size:"$subscribedTo"},
                videosCount:{$size:"$ownerVideos"},
                playlistCount:{$size:"$ownerPlaylists"}
            }
        }
    ])
    console.log(channel)

    return res
    .status(200)
    .json(new ApiResponse(200,channel[0],"Channel dashboard fetched successfully"))
})

export {channelDashboard}