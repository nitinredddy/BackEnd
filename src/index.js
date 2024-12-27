//require('dotenv').congig({path:'./env'})
import express from 'express'
import connectDB from './db/index.js';
import dotenv from 'dotenv'
import {app} from './app.js';

dotenv.config({path:'./env'})


connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Some error has occurred :",error)
        throw error
    })
    app.listen(process.env.PORT,()=>{
        console.log(`Server listening on port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("MongoDB connection failed !!! ",error)
})









/*
import express from 'express'

const app = express()
(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("Error",error)
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`app is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
       console.log(error);
       throw error; 
    }
})()
    */