import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteTweet, publishATweet,updateTweet,getAllTweets } from "../controllers/twitter.controller.js";


const router = Router();

router.route('/publish-tweet').post(verifyJWT,publishATweet)
router.route('/update-tweet/:tweetId').patch(verifyJWT,updateTweet)
router.route('/delete-tweet/:tweetId').delete(verifyJWT,deleteTweet)
router.route('/get-all-tweets/:username').get(verifyJWT,getAllTweets)


export default router