import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscriptions,getAllChannelSubscribers,getAllChannelSubscribedTo } from "../controllers/subscriptions.controller.js";

const router = Router()
router.route('/subscribe/:channelId').get(verifyJWT,toggleSubscriptions)
router.route('/get-channel-subscribers/:channelId').get(verifyJWT,getAllChannelSubscribers)
router.route('/get-channel-subscriberTo/:channelId').get(verifyJWT,getAllChannelSubscribedTo)



export default router