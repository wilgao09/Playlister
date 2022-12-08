const User = require("../models/mysql/user.model");
const Playlist = require("../models/mysql/playlist.model");
const log = require("loglevel");

const { Op } = require("sequelize");
const { getMaxListeners } = require("../app");

//TODO: FINISH
const findNextSuitableName = (username, samplename, failOnFirst = false) => {
    let match = samplename.match(/^(.*) (\(([0-9]+)\))?$/);
    let name = match ? match[0] : samplename;
    console.log("match for " + name);

    return new Promise(
        (resolve, reject) =>
            Playlist.findAll({
                where: {
                    owner: username,
                    name: samplename,
                },
            })
                .then((res) => {
                    if (res.length >= 1) {
                        if (failOnFirst) {
                            reject(`${samplename} is in use`);
                            return "rejected";
                        } else {
                            return Playlist.findAll({
                                where: {
                                    [Op.and]: [
                                        { owner: username },
                                        {
                                            name: {
                                                [Op.regexp]: `^${name} ([(][0-9]+[)])?$`,
                                            },
                                        },
                                    ],
                                },
                            });
                        }
                    } else {
                        resolve(samplename);
                        return "resolved";
                    }
                })
                .then((x) => {
                    if (typeof x == "string") return "";
                    console.log("answer set was ");
                    console.log(x);
                    if (x.length === 0) {
                        resolve(name + " (1)");
                    } else {
                        let nums = x.map((k) => {
                            k = k.dataValues.name;
                            let t = k.slice(name.length).trim();
                            return parseInt(t.slice(1, t.length - 1));
                        });
                        resolve(name + " (" + (Math.max(...nums) + 1) + ")");
                    }
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

const createPlaylist = async (req, res, next) => {
    if (!req.username || !req.body.name) {
        return res.status(400).json({ err: "Missing information" });
    }
    // TODO: unique name
    req.body.name = await findNextSuitableName(req.username, req.body.name);
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
            if (list.owner !== req.username) {
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
    Playlist.findAll({ where: { name: req.body.name, owner: req.username } })
        .then((ans) => {
            if (ans.length > 0) {
                throw {
                    status: 400,
                    err: `Another one of your lists has the name ${req.body.name}`,
                };
            }
            return Playlist.findByPk(id);
        })

        .then((list) => {
            if (list.owner !== req.username || list.published) {
                throw { status: 403, err: "Unauthorized action" };
            }
            return Playlist.update(
                { name: req.body.name },
                { where: { _id: id } }
            );
        })
        .then(() => res.status(200).send())
        .catch((e) => res.status(e.status ?? 500).json({ err: e }));
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
            return findNextSuitableName(req.username, list.name);
        })
        .then((name) => {
            req.body.name = name;
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
