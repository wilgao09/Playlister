const Playlist = require("../models/mysql/playlist.model");
const Pls = require("../models/mysql/pls.model");
const Like = require("../models/mysql/like.model");
const Song = require("../models/mysql/song.model");
const sequelize = require("sequelize");
const { Op } = sequelize;

const log = require("loglevel");
const Comment = require("../models/mysql/comment.model");

var getCorrectedData = (whereObj, username) => {
    whereObj.include = [
        {
            model: Like,
            as: "likes",
            required: false,
            attributes: [],
        },
    ];
    if (username === undefined) {
        username = "";
    }
    whereObj.attributes = [
        "_id",
        "listens",
        "name",
        "published",
        "createdAt",
        "updatedAt",
        "owner",
        [
            sequelize.fn("COUNT", sequelize.fn("IF", { liked: 1 }, 1, null)),
            "upvotes",
        ],
        [
            sequelize.fn("COUNT", sequelize.fn("IF", { liked: 0 }, 1, null)),
            "downvotes",
        ],
        [
            sequelize.fn(
                "COUNT",
                sequelize.fn("IF", { liked: 1, username: username }, 1, null)
            ),
            "userLiked",
        ],
        [
            sequelize.fn(
                "COUNT",
                sequelize.fn("IF", { liked: 0, username: username }, 1, null)
            ),
            "userDisliked",
        ],
    ];
    whereObj.group = ["_id"];
    return whereObj;
};

// setTimeout(async () => {
//     Playlist.findAll(
//         getCorrectedData({
//             where: {
//                 owner: "xolaani",
//             },
//         })
//     ).then((ans) => {
//         let printable = [];
//         for (let k of ans) printable.push(k.dataValues);
//         log.error(printable);
//         log.error("ANSWER^^^^^");
//     });
// }, 1000);

const getUserLists = (req, res, next) => {
    if (!req.username) {
        return res.status(400).json({ err: "Missing information" });
    }
    let where = {
        owner: req.username,
    };
    if (req.query.name) {
        where.name = {
            [Op.like]: `%${req.query.name}%`,
        };
    }
    Playlist.findAll(
        getCorrectedData(
            {
                where: where,
            },
            req.username
        )
    )
        .then((data) => res.status(200).json({ playlists: data }))
        .catch((reason) => res.status(404).json({ err: reason }));
};

const searchPlaylist = (req, res, next) => {
    if (!req.query.name) {
        return res.status(200).json({ playlists: [] });
    }
    let stmt = {
        where: {
            [Op.and]: [
                {
                    name: { [Op.like]: `%${req.query.name}%` },
                },
                {
                    published: true,
                },
            ],
        },
    };
    if (req.username) {
        stmt = {
            where: {
                [Op.and]: [
                    {
                        name: { [Op.like]: `%${req.query.name}%` },
                    },
                    {
                        [Op.or]: {
                            published: true,
                            owner: req.username,
                        },
                    },
                ],
            },
        };
    }
    //TODO: figure out status codes
    Playlist.findAll(getCorrectedData(stmt, req.username))
        .then((data) => res.status(200).json({ playlists: data }))
        .catch((reason) => res.status(500).json({ playlists: reason }));
};

const searchUser = (req, res, next) => {
    if (!req.query.name) {
        return res.status(200).json({ playlists: [] });
    }
    let stmt = {
        where: {
            [Op.and]: [
                {
                    owner: { [Op.like]: `%${req.query.name}%` },
                },
                {
                    published: true,
                },
            ],
        },
    };
    if (req.username) {
        stmt = {
            where: {
                [Op.and]: [
                    {
                        owner: { [Op.like]: `%${req.query.name}%` },
                    },
                    {
                        [Op.or]: {
                            published: true,
                            owner: req.username,
                        },
                    },
                ],
            },
        };
    }
    //TODO: figure out status codes
    Playlist.findAll(getCorrectedData(stmt, req.username))
        .then((data) => res.status(200).json({ playlists: data }))
        .catch((reason) => res.status(500).json({ playlists: reason }));
};

// const searchSelf = (req, res, next) => {
//     if (!req.query.name || !req.username) {
//         return res.status(400).json({ err: "Missing information" });
//     }
//     let stmt = {
//         where: {
//             [Op.and]: [
//                 {
//                     owner: req.query.name,
//                 },
//                 {
//                     name: {
//                         [Op.like]: `%${req.query.name}$`,
//                     },
//                 },
//             ],
//         },
//     };
// };

const getPlaylistById = (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({ err: "Missing information" });
    }
    let stmt = {
        where: {
            _id: req.params.id,
        },
    };
    stmt = getCorrectedData(stmt, req.username);

    let payload = null;
    Playlist.findAll(stmt)
        .then((data) => {
            payload = data;
            console.log("PAYLOADvvv");
            console.log(payload);
            //if it does not exist, or it is private to the user
            if (
                payload.length != 1 ||
                (req.username !== payload[0].dataValues.owner &&
                    !payload[0].dataValues.published)
            ) {
                throw "Could not find playlist";
            }
            return Pls.findAll({
                include: [
                    {
                        model: Song,
                        as: "song",
                        required: true,
                        attributes: [],
                    },
                ],
                where: {
                    in: req.params.id,
                },
                attributes: [
                    [sequelize.col("song.title"), "title"],
                    [sequelize.col("song.artist"), "artist"],
                    [sequelize.col("song.youTubeId"), "youTubeId"],
                ],
                order: [["indexIn", "ASC"]],
            });
        })
        .then((dat) => {
            console.log("??????? got the query results");
            let tor = [];
            log.debug(dat);
            for (let s of dat) {
                tor.push(s.dataValues);
            }
            return res
                .status(200)
                .json({ playlist: tor, listinfo: payload[0].dataValues });
        })
        .catch((reason) => res.status(500).json({ err: reason }));
};

// setTimeout(async () => {
//     let r = await Pls.findAll({
//         include: [
//             {
//                 model: Song,
//                 as: "song",
//                 required: true,
//                 attributes: [
//                     // ["title", "title"],
//                     // ["artist", "artist"],
//                     // ["youTubeId", "youTubeId"],
//                 ],
//             },
//         ],
//         where: {
//             in: 6,
//         },
//         attributes: [
//             ["indexIn", "index"],
//             [sequelize.col("song.title"), "title"],
//             [sequelize.col("song.artist"), "artist"],
//             [sequelize.col("song.youTubeId"), "youTubeId"],
//         ],
//     });
//     console.log(r);
// }, 1000);

const getCommentsById = (req, res, next) => {
    if (!req.params.id) {
        return res.status(404).send();
    }
    let id = req.params.id;
    log.debug("trying to find a playlsit with id " + id);
    Playlist.findByPk(id)
        .then((res) => {
            if (res === null) {
                throw { status: 404, err: "Not Found" };
            }
        })
        .then(() => {
            return Comment.findAll({
                where: { playlist_id: id },
                order: [["_id", "ASC"]],
                attributes: {
                    exclude: ["updatedAt", "_id", "playlist_id"],
                },
            });
        })
        .then((ans) => {
            res.status(200).json({
                comments: ans,
            });
        })
        .catch((reason) => {
            res.status(reason.status ?? 500).json({ err: reason });
        });
};

module.exports = {
    getUserLists,
    searchPlaylist,
    searchUser,
    getPlaylistById,
    getCommentsById,
    // searchSelf,
};
