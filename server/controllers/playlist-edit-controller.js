const Playlist = require("../models/mysql/playlist.model");
const Like = require("../models/mysql/like.model");
const Comment = require("../models/mysql/comment.model");

const updatePlaylistContents = (req, res, next) => {
    //TODO: update contents
};

const publishPlaylist = (req, res, next) => {
    if (!req.username || !req.params.id) {
        return res.status(400).json({ err: "Missing information" });
    }
    Playlist.findByPk(req.params.id)
        .then((pl) => {
            if (pl.owner === req.username)
                return Playlist.update(
                    { published: true },
                    { where: { _id: req.params.id } }
                );
            else throw "Unauthorized access";
        })
        .then(() => {
            res.status(200).send();
        })
        .catch((reason) => res.status(403).json({ err: reason }));
};

const userPlaying = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ err: "Missing information" });
    }

    Playlist.findByPk(id)
        .then((pl) => {
            if (pl.owner !== req.username && !pl.published) {
                throw "Playlist not found";
            }
            return Playlist.update(
                { listens: pl.listens + 1 },
                { where: { _id: id } }
            );
        })
        .then(() => res.status(200).send())
        .catch((reason) => res.status(404).json({ err: reason }));
};

const postComment = (req, res, next) => {
    if (!req.username || !req.params.id) {
        return res.status(400).json({ err: "Missing information" });
    }

    Playlist.findByPk(req.params.id)

        .then((pl) => {
            if (pl.published) {
                return Comment.create({
                    comment: req.body.comment,
                    playlist_id: pl._id,
                    username: req.username,
                });
            } else {
                throw "Playlist does not exist";
            }
        })
        .then(() => res.status(200).send())
        //TODO: fix error code
        .catch((reason) => res.status(404).json({ err: reason }));
};

//TODO: make like/dislike toggleable
const likePlaylist = (req, res, next) => {
    if (!req.username || !req.params.id) {
        return res.status(400).json({ err: "Missing information" });
    }
    Like.findAll({
        where: { playlist_id: req.params.id, username: req.username },
    })
        .then((likeset) => {
            if (likeset.length > 0) {
                throw "Cannot like twice";
            }
        })
        .then(() => Playlist.findByPk(req.params.id))

        .then((pl) => {
            if (pl.published) {
                return Like.create({
                    liked: req.body.liked,
                    playlist_id: pl._id,
                    username: req.username,
                });
            } else {
                throw "Playlist does not exist";
            }
        })
        .then(() => res.status(200).send())
        //TODO: fix error code
        .catch((reason) => res.status(404).json({ err: reason }));
};

module.exports = {
    updatePlaylistContents,
    publishPlaylist,
    userPlaying,
    postComment,
    likePlaylist,
};
