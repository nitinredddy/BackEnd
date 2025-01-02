import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {User} from "../models/user.model.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token");
    }
}

const registerUser = asyncHandler( async (req,res) => {
    const {fullName,email,username,password} = req.body;
    console.log(req.body)
    if(
        [fullName,email,username,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required.")
    }

    const existingUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existingUser){
        throw new ApiError(409,"User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }

    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverLocalPath)

    if(!avatar){
        throw new ApiError(500,"there was some issue while uploading avatar file")
    }
    
    const user = await User.create({
        username:username.toLowerCase(),
        email:email,
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully.")
    )
})

const loginUser = asyncHandler(async (req, res) =>{
    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logOut = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{$set:{refreshToken:undefined}},{new:true}) 
    const options = {
        httpOnly:true,
        secure:true
    }
    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(
        new ApiResponse(200,{},"User loggedOut successfully")
    )
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorised request.")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"Invalid Refresh token")
        }
    
        if(incomingRefreshToken!=user?.refreshToken){
            throw new ApiError(401,"Refresh Token is expired or used")
        }
    
        const options = {
            httpOnly:true,
            secure:true
        }
    
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        res.
        status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(new ApiResponse(
            200,
            {accessToken,refreshToken:newRefreshToken},
            "access token refreshed successfully"
        ))
    } catch (error) {
        throw new ApiError(401,"Invalid refresh token" || error?.message)
    }
})

const changeCurrentUserPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body
    console.log(req.body)

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Password is incorrect")
    }

    if(oldPassword==newPassword){
        throw new ApiError(400,"new password cannot be the same as old password.")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave:false})

    return res.status(200).json(new ApiResponse(200,{},"password changed successfully"))
})

const currentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "current user fetched successfully"
    ))
        
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {username,email} = req.body

    if(!username && !email){
        throw new ApiError(
            400,
            "no changes registered"
        )
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                username,
                email
            }
        },
        {new:true}
    )
    .select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,
        user,
        "Account details updated successfully."
    ))
})

const updateUserAvatar = asyncHandler( async (req,res)=>{
    const newAvatarLocalPath = req.file?.path
    if(!newAvatarLocalPath){
        throw new ApiError(
            400,
            "Avatar file is missing"
        )
    }
    
    const newAvatar = await uploadCloudinary(newAvatarLocalPath)

    if(!newAvatar.url){
        throw new ApiError(
            500,
            "Error while uploading avatar"
        )
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:newAvatar.url
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiError(
        200,
        user,
        "User avatar updated successfully"
    ))
})

const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const newCoverImageLocalPath = req.file?.path
    if(!newCoverImageLocalPath){
        throw new ApiError(400,"Cover image file is missing")
    }

    const coverImage = await uploadCloudinary(newCoverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(500,"Error while uploading cover image file")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new:true}
    ).select("-password")
    return res
    .status(200)
    .json(new ApiError(200,user,"User coverimage updated successfully"))
})
export {registerUser,loginUser,logOut,refreshAccessToken,changeCurrentUserPassword,currentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage}

