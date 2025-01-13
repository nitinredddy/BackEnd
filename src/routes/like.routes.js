import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleLikeOnComments, toggleLikeOnTweets, toggleLikeOnVideo } from "../controllers/like.controller.js";

const router = Router()

router.route('/video/:videoId').get(verifyJWT,toggleLikeOnVideo)
router.route('/tweet/:tweetId').get(verifyJWT,toggleLikeOnTweets)
router.route('/comment/:commentId').get(verifyJWT,toggleLikeOnComments)



export default router