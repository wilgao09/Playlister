var express = require("express");
const router = express.Router();
const PlaylistCreationController = require("../controllers/playlist-creation-controller");
const verify = require("../auth/index").verify;
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

module.exports = router;
