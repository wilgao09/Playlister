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
     * type is one of "CREATE" "DELETE" "EDIT" "MOVE"
     * d0 is the index
     * d1 is the information (Song | Index | Song | Index)
     *
     */
    let missingFields1 = !req.username || !req.params.id;
    let delta = req.body.delta;
    let missingFields2 =
        !delta.type || delta.d0 === undefined || delta.d1 === undefined;
    if (missingFields1 || missingFields2) {
        log.error(
            `${req.username}, ${req.params.id}, ${delta.type}, ${delta.d0}, ${delta.d1}`
        );
        return res.status(400).json({ err: "Missing information" });
    }

    Playlist.findByPk(req.params.id).then(async (pl) => {
        pl = pl.dataValues;

        if (pl === undefined || pl._id === undefined) {
            return res.status(400).json({ err: "Playlist not found" });
        }
        if (pl.published) {
            return res.status(403).json({ err: "Cannot edit published list" });
        }
        if (pl.owner !== req.username) {
            return res.status(404).json({ err: "Playlist not found" });
        }
        console.log("reqbody looks like");
        console.log(req.body);

        let t;

        req.params.id = parseInt(req.params.id);

        let id = pl._id;
        console.log("HERES THE ENTIRE REQ");
        console.log(pl);
        // try {
        switch (delta.type) {
            //TODO: type check d0, d1
            case "CREATE": {
                let song;
                console.log("TRY TO FIND IN THIS PLAYLSIT ID");
                console.log(pl._id);
                sequelize
                    .transaction()
                    .then((k) => {
                        t = k;
                        return Pls.update(
                            {
                                indexIn: sequelize.literal(" indexIn + 1 "),
                            }, //increment index on all rows before d0
                            {
                                where: {
                                    in: { [Op.eq]: id },
                                    indexIn: { [Op.gte]: delta.d0 },
                                    // _id: {
                                    //     [Op.eq]: sequelize.literal("`_id`"),
                                    // },
                                },
                                transaction: t,
                            }
                        );
                    })

                    .then(() => {
                        log.debug("completed update");
                        return Song.findAll({
                            where: {
                                title: delta.d1.title,
                                artist: delta.d1.artist,
                                youTubeId: delta.d1.youTubeId,
                            },
                            limit: 1,
                            lock: true,
                            transaction: t,
                        });
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
                        song = s[0].dataValues;
                        console.log("song is");
                        console.log(song);
                        return Song.update(
                            { refs: song.refs + 1 },
                            { where: { _id: song._id }, transaction: t }
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
                    .then(() => res.status(200).send())
                    .catch((err) => {
                        t.rollback();
                        res.status(err.status ?? 500).json({ err: err });
                    });
                return;
            }
            //TODO: fix race condition
            case "DELETE": {
                sequelize
                    .transaction()
                    .then((k) => {
                        t = k;
                        return Pls.findAll({
                            where: { in: req.params.id, indexIn: delta.d0 },
                            transaction: t,
                            limit: 1,
                            lock: true,
                        });
                    })

                    .then((plsobj) => {
                        if (plsobj.length < 1) {
                            //TODO: song doesnt exist
                            console.log("DOESNT EXIST; UHOH");
                        }
                        plsobj = plsobj[0].dataValues;
                        console.log(plsobj);
                        return Song.findByPk(plsobj.song_id, {
                            transaction: t,
                            lock: true,
                        });
                    })
                    .then((s) => {
                        if (s.refs === 1) {
                            return Song.destroy({
                                where: { _id: s._id },
                                transaction: t,
                            });
                        } else {
                            return Song.update(
                                { refs: s.refs - 1 },
                                {
                                    where: { _id: s._id },
                                    transaction: t,
                                }
                            );
                        }
                    })
                    .then(() => t.commit())
                    .then(() => {
                        console.log(delta);
                        return Pls.destroy({
                            where: {
                                in: req.params.id,
                                indexIn: delta.d0,
                            },
                        });
                    })
                    .then(() => {
                        return Pls.update(
                            { indexIn: sequelize.literal("indexIn-1") },
                            {
                                where: {
                                    indexIn: { [Op.gt]: delta.d0 },
                                },
                            }
                        );
                    })

                    .then(() => res.status(200).send())
                    .catch((err) => {
                        t.rollback();
                        res.status(err.status ?? 500).json({ err: err });
                    });
                return;
            }
            case "EDIT": {
                let todelete = null;
                sequelize
                    .transaction()
                    .then((k) => (t = k))
                    .then(() =>
                        Pls.findAll({
                            where: {
                                in: req.params.id,
                                indexIn: delta.d0,
                            },
                            transaction: t,
                        })
                    )

                    .then((pls) => {
                        if (pls.length != 1) {
                            //TODO: error out
                            throw "SHIT";
                        }
                        pls = pls[0].dataValues;
                        console.log("PLS is");
                        console.log(pls);
                        return Song.findByPk(pls.song_id, {
                            transaction: t,
                            lock: true,
                        });
                    })
                    .then((s) => {
                        //TODO:
                        // if s doesnt exist
                        if (s.refs == 1) {
                            todelete = s;
                            return;
                        } else {
                            return Song.update(
                                { refs: s.refs - 1 },
                                { where: { _id: s._id }, transaction: t }
                            );
                        }
                    })
                    .then(() => {
                        return Song.findAll({
                            where: {
                                title: delta.d1.title,
                                artist: delta.d1.artist,
                                youTubeId: delta.d1.youTubeId,
                            },
                            transaction: t,
                            lock: true,
                        });
                    })
                    .then((sres) => {
                        if (sres.length == 1) {
                            sres = sres[0].dataValues;
                            console.log(sres);
                            return Song.update(
                                { refs: sres.refs + 1 },
                                {
                                    where: {
                                        _id: sres._id,
                                    },
                                    transaction: t,
                                }
                            ).then(() => sres._id);
                        } else {
                            return Song.create(
                                {
                                    title: delta.d1.title,
                                    artist: delta.d1.artist,
                                    youTubeId: delta.d1.youTubeId,
                                    refs: 1,
                                },
                                { transaction: t }
                            ).then((o) => o.dataValues._id);
                        }
                    })
                    .then((id) => {
                        return Pls.update(
                            {
                                song_id: id,
                            },
                            {
                                where: {
                                    in: req.params.id,
                                    indexIn: delta.d0,
                                },
                                transaction: t,
                            }
                        );
                    })
                    .then(() => t.commit())
                    .then(
                        () => {
                            if (todelete !== null) {
                                return Song.destroy({
                                    where: { _id: todelete._id },
                                });
                            }
                        }
                        // todelete == null ? todelete.destroy() : undefined
                    )
                    .then(() => res.status(200).send())
                    .catch((err) => {
                        t.rollback();
                        res.status(err.status ?? 500).json({ err: err });
                    });
                return;
            }
            case "MOVE": {
                //TODO: move
                let tomove = null;
                let t;
                sequelize
                    .transaction()
                    .then((k) => {
                        t = k;
                        return Pls.findAll({
                            where: {
                                in: req.params.id,
                                indexIn: delta.d0,
                            },
                            transaction: t,
                            limit: 1,
                            lock: true,
                        });
                    })
                    .then((plsobj) => {
                        if (plsobj.length != 1) {
                            throw {
                                status: 404,
                                err: "Index Out of Bounds",
                            };
                        }
                        plsobj = plsobj[0].dataValues;
                        tomove = plsobj;
                        return Pls.findAll({
                            where: {
                                in: req.params.id,
                                indexIn: delta.d1,
                            },
                            transaction: t,
                            limit: 1,
                            lock: true,
                        });
                    })
                    .then((destobj) => {
                        if (destobj.length != 1) {
                            throw {
                                status: 404,
                                err: "Index Out of Bounds",
                            };
                        }
                        return Pls.update(
                            {
                                indexIn: sequelize.literal(" indexIn - 1 "),
                            },
                            {
                                where: {
                                    indexIn: { [Op.gt]: delta.d0 },
                                },
                                transaction: t,
                            }
                        );
                    })
                    .then(() => {
                        return Pls.update(
                            {
                                indexIn: sequelize.literal(" indexIn + 1 "),
                            },
                            {
                                where: {
                                    indexIn: { [Op.gte]: delta.d1 },
                                },
                                transaction: t,
                            }
                        );
                    })
                    .then(() => {
                        return Pls.update(
                            { indexIn: delta.d1 },
                            { where: { _id: tomove._id }, transaction: t }
                        );
                    })
                    .then(() => t.commit())
                    .then(() => res.send(200).send())
                    .catch(
                        (err) =>
                            t.rollback() &&
                            res.status(err.status ?? 500).json({ err: err })
                    );
                return;
            }
            default: {
                res.status(400).json({
                    err: `${delta.type} is not a valid delta type`,
                });
                return;
            }
        }
        // } catch (e) {
        //     t.rollback();
        //     console.error("ROLLED BACK!");
        //     res.status(500).json({ err: e }).send();
        // }
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
    let id = parseInt(req.params.id);

    Playlist.findByPk(id)
        .then((pl) => {
            if (pl.owner !== req.username && !pl.published) {
                throw "Playlist not found";
            }
            return Playlist.update(
                { listens: pl.listens + 1 },
                { where: { _id: id }, silent: true }
            );
        })
        .then(() => res.status(200).send())
        .catch((reason) => {
            res.status(404).json({ err: reason });
        });
};

const postComment = (req, res, next) => {
    if (!req.username || !req.params.id || !req.body.comment) {
        return res.status(400).json({ err: "Missing information" });
    }

    if (req.body.comment.length > 255) {
        req.body.comment = req.body.comment.slice(0, 255);
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
