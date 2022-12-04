var express = require("express");
const router = express.Router();
const PlaylistCreationController = require("../controllers/playlist-creation-controller");
const PlaylistSearchController = require("../controllers/playlist-search-controller");
const PlaylistEditController = require("../controllers/playlist-edit-controller");
const { verify } = require("../auth/index");
// const PlaylistSearchController =
router.post("/playlist", verify, PlaylistCreationController.createPlaylist);
router.delete(
    "/playlist/:id",
    verify,
    PlaylistCreationController.deletePlaylist
);
router.put(
    "/playlist/rename/:id",
    verify,
    PlaylistCreationController.renamePlaylist
);
router.post(
    "/playlist/duplicate/:id",
    verify,
    PlaylistCreationController.duplicatePlaylist
);
/**
 * Playlist search
 */

router.get("/playlist", verify, PlaylistSearchController.getUserLists);

router.get(
    "/playlist/searchPlaylist",
    (req, res, next) => verify(req, res, next, true),
    PlaylistSearchController.searchPlaylist
);

router.get(
    "/playlist/searchUser",
    (req, res, next) => verify(req, res, next, true),
    PlaylistSearchController.searchUser
);

router.get(
    "/playlist/:id",
    (req, res, next) => verify(req, res, next, true),
    PlaylistSearchController.getPlaylistById
);

router.get("/playlist/comment/:id", PlaylistSearchController.getCommentsById);

/**
 * playlist edit
 */
router.put(
    "/playlist/contents/:id",
    verify,
    PlaylistEditController.updatePlaylistContents
);

router.post(
    "/playlist/publish/:id",
    verify,
    PlaylistEditController.publishPlaylist
);

router.post(
    "/playlist/userPlaying/:id",
    (req, res, next) => verify(req, res, next, true),
    PlaylistEditController.userPlaying
);

router.post("/playlist/comment", verify, PlaylistEditController.postComment);

router.post("/playlist/like/:id", verify, PlaylistEditController.likePlaylist);

module.exports = router;
