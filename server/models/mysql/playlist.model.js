const { DataTypes } = require("sequelize");
const log = require("loglevel");
const sequelize = require("./sequelize");
const User = require("./user.model");
const Pls = require("./pls.model");
const Like = require("./like.model");
let Playlist = null;
// create users table

Playlist = sequelize.define("playlists", {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    listens: {
        type: DataTypes.INTEGER,
    },
    published: {
        type: DataTypes.BOOLEAN,
    },
});

// Playlist.belongsTo(User, {
//     foreignKey: "owner",
//     targetKey: "_id",
// });
Playlist.hasMany(Pls, {
    foreignKey: "in",
    targetKey: "_id",
});

Playlist.hasMany(Like, {
    foreignKey: "playlist_id",
    targetKey: "_id",
    as: "likes",
});

module.exports = Playlist;
