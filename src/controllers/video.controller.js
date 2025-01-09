import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js"
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

const publishAVideo = asyncHandler(async(req,res)=>{
    const {title,description} = req.body

    if([title,description].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"Title and Description are required")
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if(!(videoLocalPath && thumbnailLocalPath)){
        throw new ApiError(400,"Video file is missing")
    }

    const videoFile = await uploadCloudinary(videoLocalPath)
    const thumbnail = await uploadCloudinary(thumbnailLocalPath)

    if(!(videoFile.url && thumbnail.url)){
        throw new ApiError(500,"There was some issue while uploading files")
    }

    const video = await Video.create({
        videoFile:videoFile.url,
        thumbnail:thumbnail.url,
        title:title,
        description:description,
        owner:req.user._id,
        duration:videoFile.duration
    })

    return res
    .status(200)
    .json(new ApiResponse(200,video,"Video Published Successfully"))

})

const updateVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params

    if(!videoId){
        throw new ApiError(400,"Please provide a video ID")
    }

    const {title,description} = req.body

    const newThumbnailLocalPath = req.file?.path || ""

    const newThumbnail = await uploadCloudinary(newThumbnailLocalPath) || ""
    

    const video = await Video.findByIdAndUpdate(videoId,{
        title:title,
        description:description,
        thumbnail:newThumbnail.url
    })

    return res
    .status(200)
    .json(new ApiResponse(200,video,"VideoFile was updated"))
})

const getVideoById = asyncHandler(async(req,res)=>{
    const {videoId} = req.params

    if(!videoId){
        throw new ApiError(400,"Please provide the videoID")
    }

    const video = await Video.findById(videoId)

    return res
    .status(200)
    .json(new ApiResponse(200,video,"Video details fetched successfully"))
})

const deleteVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,"Please provide the videoID")
    }

    const video = await Video.findByIdAndDelete(videoId)

    if(!video){
        throw new ApiError(400,"Video ID does not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,video,"Video deleted successfully"))
})

const getAllVideos = asyncHandler(async(req,res)=>{
    const {username} = req.params

    if(!username.trim()){
        throw new ApiError(400,"Please provide me a username")
    }

    const allUserVideo = await User.aggregate([
        {
            $match:{
                username:username.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"_id",
                foreignField:"owner",
                as:"userVideos"
            }
        },
        {
            $project:{
                userVideos:1,
                fullName:1,
                username:1,
                avatar:1,
                coverimage:1
            }
        }
    ])

    console.log(allUserVideo)

    return res
    .status(200)
    .json(new ApiResponse(200,allUserVideo[0],"User Videos fetched successfully"))
})

export {publishAVideo,updateVideo,getVideoById,deleteVideo,getAllVideos}