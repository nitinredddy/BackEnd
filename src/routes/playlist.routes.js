import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist,addVideosToPlaylist,findPlayList,getUserPlayLists,removeVideosFromPlayList,deletePlayList,updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router()

router.route('/create-playlist').post(verifyJWT,createPlaylist)
router.route('/add-video-to-playlist/:playlistTitle').patch(verifyJWT,addVideosToPlaylist)
router.route('/find-playlist/:playlistTitle').get(verifyJWT,findPlayList)
router.route('/get-user-playlists/:userId').get(verifyJWT,getUserPlayLists)
router.route('/remove-videos-from-playlist/:playlistTitle').get(verifyJWT,removeVideosFromPlayList)
router.route('/delete-playlist/:playlistTitle').delete(verifyJWT,deletePlayList)
router.route('/update-playlist/:playlistTitle').patch(verifyJWT,updatePlaylist)





export default router