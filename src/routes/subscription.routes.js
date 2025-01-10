import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscriptions } from "../controllers/subscriptions.controller.js";

const router = Router()
router.route('/subscribe/:channelId').get(verifyJWT,toggleSubscriptions)

export default router