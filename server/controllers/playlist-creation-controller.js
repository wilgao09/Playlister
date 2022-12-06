const User = require("../models/mysql/user.model");
const Playlist = require("../models/mysql/playlist.model");
const log = require("loglevel");

const { Op } = require("sequelize");

//TODO: FINISH
const findNextSuitableName = (username, samplename, failOnFirst = false) => {
    let match = samplename.match(/^(.*) (\(([0-9]+)\))?$/);
    let name = match ? match[0] : samplename;

    return new Promise(
        (resolve, reject) =>
            Playlist.findAll({
                where: {
                    owner: username,
                    name: samplename,
                },
            }).then((res) => {
                if (res.length >= 1) {
                    if (failOnFirst) {
                        reject(`${samplename} is in use`);
                    } else {
                        return Playlist.findAll({
                            where: {
                                [Op.and]: [
                                    { owner: username },
                                    {
                                        name: {
                                            [Op.regexp]: `^${name} ([(][0-9]+[)])$`,
                                        },
                                    },
                                ],
                            },
                        });
                    }
                } else {
                    resolve(samplename);
                }
                return null;
            })
        // Playlist.findAll({
        //     where: {
        //         [Op.and]: [
        //             { owner: username },
        //             {
        //                 name: {
        //                     [Op.regexp]: "^.* (([0-9]+))?$",
        //                 },
        //             },
        //         ],
        //     },
        // }).then((res) => {
        //     console.log(res);
        // })
    );
};

// setTimeout(async () => {
//     console.log(await findNextSuitableName("xolaani", "BestList"));
//     console.log("ANSWER^^^^^^^");
// }, 1000);

const createPlaylist = (req, res, next) => {
    if (!req.username || !req.body.name) {
        return res.status(400).json({ err: "Missing information" });
    }
    // TODO: unique name
    Playlist.create({
        owner: req.username,
        name: req.body.name,
        listens: 0,
        published: false,
    })
        .then((obj) => {
            res.status(201).json({
                success: true,
                data: {
                    playlist: obj,
                },
            });
        })
        .catch((reason) => res.status(500).json({ err: reason }));
};

const deletePlaylist = (req, res, next) => {
    const id = req.params.id;
    if (!req.username || !id) {
        return res.status(400).json({ err: "Missing information" });
    }
    let errMessage = "";
    Playlist.findByPk(id)
        .then((list) => {
            log.debug(list.owner);
            if (list.owner !== req.username || list.published) {
                errMessage = "Unauthorized action";
                throw "Unauthorized action";
            }
            return Playlist.destroy({ where: { _id: id } });
        })
        .then(() => res.status(200).send())
        .catch((e) =>
            errMessage
                ? res.status(401).json({ err: errMessage })
                : res.status(500).json({ err: e })
        );
};

const renamePlaylist = (req, res, next) => {
    let id = req.params.id;
    if (!req.username || !id || !req.body.name) {
        return res.status(400).json({ err: "Missing information" });
    }
    findNextSuitableName(req.username, req.body.name)
        .then(() => Playlist.findByPk(id))

        .then((list) => {
            if (list.owner !== req.username || list.published) {
                throw "Unauthorized action";
            }
            return Playlist.update(
                { name: req.body.name },
                { where: { _id: id } }
            );
        })
        .then(() => res.status(200).send())
        .catch((e) => res.status(403).json({ err: e }));
};

const duplicatePlaylist = (req, res, next) => {
    let id = req.params.id;
    if (!req.username || !id) {
        return res.status(400).json({ err: "Missing information" });
    }
    let errMessage = "";
    Playlist.findByPk(id)
        .then((list) => {
            if (list.owner !== req.username && !list.published) {
                errMessage = "Unauthorized action";
                throw "Unauthorized action";
            }
            // TODO: unique names
            req.body.name = list.name + " (DUPLICATE)";
            createPlaylist(req, res, next);
        })
        .catch((e) =>
            errMessage
                ? res.status(403).json({ err: errMessage })
                : res.status(500).json({ err: e })
        );
};

module.exports = {
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    duplicatePlaylist,
};
