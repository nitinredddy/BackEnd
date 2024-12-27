import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    username:{
        type:String,
        required:true,
        unique:true,
        lowerCase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowerCase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, //cloudinary url
        required:true,
    },
    coverImage:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:[true,"Password cannot be empty."]
    },
    refreshToken:{
        type:String,
        required:true
    }
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = bcrypt.hash(this.password,8)
        next()
    }
    else{
        return next()
    }
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName,
        },
        process.env.REFRESH_TOKEN,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)