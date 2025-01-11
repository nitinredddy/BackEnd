import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async(req,res)=>{
    const {title,description} = req.body
    const owner = req.user._id

    if(!title){
        throw new ApiError(400,"Title is minimum requirement for creating a playlist")
    }

    const newPlayList = await Playlist.create({
        title:title,
        description:description,
        owner:owner,
    })

    console.log(newPlayList)

    return res
    .status(200)
    .json(new ApiResponse(200,newPlayList,"New Playlist created"))
})

const addVideosToPlaylist = asyncHandler(async(req,res)=>{
    const {playlistTitle} = req.params
    const {videoId} = req.body

    if(!playlistTitle.trim()){
        throw new ApiError(400,"Please provide the playlist name in which you want to add the video")
    }

    if(!videoId){
        throw new ApiError(400,"Please provide the video Id you want to add in the playlist")
    }

    const insertingVideoInPlaylist = await Playlist.findOneAndUpdate(
        {
            title:playlistTitle,
            owner:req.user._id
        },
        {
            $addToSet:{videos:videoId}
        },
        {
            new:true
        }
    )

    if(!insertingVideoInPlaylist){
        throw new ApiError(400,"Playlist not found or you dont have access to add videos to the playlist")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,insertingVideoInPlaylist,"Video added successfully in the playlist"))
})

const findPlayList = asyncHandler(async(req,res)=>{
    const {playlistTitle} = req.params

    if(!playlistTitle){
        throw new ApiError(400,"Please provide the playlist title")
    }

    const playList = await Playlist.findOne({
        title:playlistTitle
    })

    if(!playList){
        throw new ApiError(400,"PlayList not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,playList,"PlayList found successfully"))
})

const getUserPlayLists = asyncHandler(async(req,res)=>{
    const {userId} = req.params
    if(!userId){
        throw new ApiError(400,"Provide the user Id to get their playlists")
    }

    const allPlayLists = await User.aggregate([
        {
            $match:{_id:new mongoose.Types.ObjectId(userId)}
        },
        {
            $lookup:{
                from:"playlists",
                localField:"_id",
                foreignField:"owner",
                as:"allPlaylists"
            }
        },
        {
            $addFields:{
                numberOfPlayLists:{
                    $size:"$allPlaylists"
                }
            }
        },
        {
            $project:{
                username:1,
                fullName:1,
                allPlaylists:1,
                avatar:1
            }
        }
    ])
    console.log(allPlayLists)
    return res
    .status(200)
    .json(new ApiResponse(200,allPlayLists,"Fetched all playlists associated with user id"))
})

const removeVideosFromPlayList = asyncHandler(async(req,res)=>{
    const {playlistTitle} = req.params
    const {videoId} = req.body
    const currentUser = req.user._id

    if(!playlistTitle){
        throw new ApiError(400,"Please provide a playlist")
    }
    if(!videoId){
        throw new ApiError(400,"Please provide the videoId of the video which you want to remove from playlist")
    }

    const deleteVideo = await Playlist.findOneAndUpdate(
        {
            title:playlistTitle,
            owner:currentUser
        },
        {
            $pull:{videos:videoId}
        },
        {
            new:true
        }
    )
    if(deleteVideo.videos.length == 0){
        throw new ApiError(400,"No videos in playlist")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,deleteVideo,"Video removed from playlist successfully"))
})

const deletePlayList = asyncHandler(async(req,res)=>{
    const {playlistTitle} = req.params

    if(!playlistTitle){
        throw new ApiError(400,"Please provide the title of the playlist you wish to delete")
    }

    const deletedPlayList = await Playlist.findOneAndDelete(
        {
            title:playlistTitle,
            owner:req.user._id
        }
    )

    if(!deletedPlayList){
        throw new ApiError(400,"Either the playlist does not belong to you or it does not exist")
    }



    return res
    .status(200)
    .json(new ApiResponse(200,deletedPlayList,"PlayList deleted successfully"))
})

const updatePlaylist = asyncHandler(async(req,res)=>{
    const {title,description} = req.body
    const {playlistTitle} = req.params

    if(!playlistTitle){
        throw new ApiError(400,"Please provide the title of the playlist you wish to update details of")
    }

    const updatedPlayList = await Playlist.findOneAndUpdate(
        {
            title:playlistTitle,
            owner:req.user._id
        },
        {
            title:title,
            description:description
        },
        {
            new:true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200,updatedPlayList,"Playlist updated successfully"))
})

export {createPlaylist,addVideosToPlaylist,findPlayList,getUserPlayLists,removeVideosFromPlayList,deletePlayList,updatePlaylist}