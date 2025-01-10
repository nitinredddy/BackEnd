import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())



/*--------------------------------------------------------------------------------------------------------*/



import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import subscriptionRouter from "./routes/subscription.routes.js"
import likeRouter from "./routes/like.router.js"
import commentRouter from "./routes/comment.router.js"

app.use('/api/v1/users',userRouter)
app.use('/api/v1/videos',videoRouter)
app.use('/api/v1/tweets',tweetRouter)
app.use('/api/v1/subscriptions',subscriptionRouter)
app.use('/api/v1/likes',likeRouter)
app.use('/api/v1/comments',commentRouter)



export { app }