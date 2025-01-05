import {Router} from 'express'
import {logOut, registerUser,refreshAccessToken,updateUserAvatar,changeCurrentUserPassword,updateAccountDetails,updateUserCoverImage,currentUser,getUserChannelProfile, getUserWatchHistory} from '../controllers/user.controller.js'
import { loginUser } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'


const router = Router()

router.route('/register').post(
    upload.fields([
        {
            name:'avatar',
            maxCount:1
        },
        {
            name:'coverImage',
            maxCount:1
        }
    ]),registerUser
)

router.route('/login').post(loginUser)

//secured routes
router.route('/logout').post(verifyJWT,logOut)
router.route('/refresh-token').post(verifyJWT,refreshAccessToken)
router.route('/update-avatar').patch(verifyJWT,upload.single('avatar'),updateUserAvatar)
router.route('/update-cover-image').patch(verifyJWT,upload.single('coverImage'),updateUserCoverImage)
router.route('/change-password').post(verifyJWT,changeCurrentUserPassword)
router.route('/update-account-details').patch(verifyJWT,updateAccountDetails)
router.route('/get-user').get(verifyJWT,currentUser)
router.route('/c/:username').get(verifyJWT,getUserChannelProfile)
router.route('/history').get(verifyJWT,getUserWatchHistory)

export default router;