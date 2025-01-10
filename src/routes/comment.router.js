import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createComment,deleteComment,getAllCommentsOnAVideo, updateComment } from "../controllers/comment.controller.js";

const router = Router()

router.route('/create-comment/:videoId').post(verifyJWT,createComment)
router.route('/delete-comment/:commentId').delete(verifyJWT,deleteComment)
router.route('/get-comments/:videoId').get(verifyJWT,getAllCommentsOnAVideo)
router.route('/update-comment/:commentId').patch(verifyJWT,updateComment)




export default router