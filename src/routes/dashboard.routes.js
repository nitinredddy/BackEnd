import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { channelDashboard } from "../controllers/dashboard.controller.js";

const router = Router()

router.route('/:channelName').get(verifyJWT,channelDashboard)

export default router