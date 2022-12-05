const Playlist = require("../models/mysql/playlist.model");
const Like = require("../models/mysql/like.model");
const Comment = require("../models/mysql/comment.model");
const sequelize = require("../models/mysql/sequelize");
const Pls = require("../models/mysql/pls.model");
const Song = require("../models/mysql/song.model");

const { Op } = require("sequelize");

const log = require("loglevel");

const updatePlaylistContents = (req, res, next) => {
    //TODO: update contents
    /**
     *
     * a delta is a object with 3 fields
     * type, d0, d1
     * type is one of "ADD" "DELETE" "EDIT" "MOVE"
     * d0 is the index
     * d1 is the information (Song | Song | Song | Index)
     *
     */
    let missingFields1 = !req.username || !req.params.id;
    let delta = req.body;
    let missingFields2 =
        !delta.type || delta.d0 === undefined || delta.d1 === undefined;
    if (missingFields1 || missingFields2) {
        log.error(
            `${req.username}, ${req.params.id}, ${delta.type}, ${delta.d0}, ${delta.d1}`
        );
        return res.status(400).json({ err: "Missing information" });
    }

    Playlist.findByPk(req.params.id).then(async (pl) => {
        if (pl.published) {
            return res.status(403).json({ err: "Cannot edit published list" });
        }
        if (pl.owner !== req.username) {
            return res.status(404).json({ err: "Playlist not found" });
        }
        log.debug("initializing transaction");
        const t = await sequelize.transaction();
        log.debug("transaction initialized");
        try {
            switch (delta.type) {
                //TODO: type check d0, d1
                case "ADD": {
                    let song;
                    Pls.update(
                        { indexIn: sequelize.literal("indexIn+1") }, //increment index on all rows before d0
                        {
                            where: {
                                indexIn: { [Op.gte]: delta.d0 },
                                in: pl._id,
                            },
                        },
                        {
                            transaction: t,
                        }
                    )
                        .then(() => {
                            log.debug("completed update");
                            return Song.findAll(
                                {
                                    where: {
                                        title: delta.d1.title,
                                        artist: delta.d1.artist,
                                        youTubeId: delta.d1.youTubeId,
                                    },
                                },
                                {
                                    limit: 1,
                                    lock: true,
                                    transaction: t,
                                }
                            );
                        })
                        .then((s) => {
                            if (s.length == 0) {
                                return Song.create(
                                    {
                                        title: delta.d1.title,
                                        artist: delta.d1.artist,
                                        youTubeId: delta.d1.youTubeId,
                                        refs: 1,
                                    },
                                    { transaction: t }
                                ).then((s) => (song = s));
                            }
                            return Song.update(
                                { ref: s.ref + 1 },
                                { where: { _id: s._id } },
                                { transaction: t }
                            );
                        })
                        .then(() => {
                            return Pls.create(
                                {
                                    in: req.params.id,
                                    song_id: song._id,
                                    indexIn: delta.d0,
                                },
                                { transaction: t }
                            );
                        })
                        .then(() => t.commit())
                        .then(() => res.status(200).send());
                }
                case "DELETE": {
                    Pls.findAll(
                        { where: { in: req.params.id, indexIn: delta.d0 } },
                        { transaction: t, limit: 1, lock: true }
                    )
                        .then((plsobj) => {
                            if (plsobj.length < 1) {
                                //TODO: song doesnt exist
                            }
                            return Song.findAll(
                                { where: { _id: plsobj.song_id } },
                                { transaction: t, lock: true, limit: 1 }
                            ).then((s) => {
                                if (s.refs === 1) {
                                    return Song.destroy(
                                        { where: { _id: s._id } },
                                        { transaction: t }
                                    );
                                } else {
                                    Song.update(
                                        { refs: s.refs - 1 },
                                        { where: { _id: s._id } },
                                        { transaction: t }
                                    );
                                }
                            });
                        })
                        .then(() => {
                            return Pls.destroy(
                                {
                                    where: {
                                        in: req.body.id,
                                        indexIn: delta.d0,
                                    },
                                },
                                { transaction: t }
                            );
                        })
                        .then(() => {
                            return Pls.update(
                                { indexIn: sequelize.literal("indexIn-1") },
                                { where: { indexIn: { [Op.gt]: delta.d0 } } }
                            );
                        })
                        .then(() => t.commit)
                        .then(res.status(200).send());
                }
                case "EDIT": {
                    //TODO: edit
                    return;
                }
                case "MOVE": {
                    //TODO: move
                }
                default: {
                    res.status(400).json({
                        err: `${delta.type} is not a valid delta type`,
                    });
                    return;
                }
            }
        } catch (e) {
            t.rollback();
            console.error("ROLLED BACK!");
            res.status(500).json({ err: e }).send();
        }
    });
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
