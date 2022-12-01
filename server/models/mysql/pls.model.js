const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const Song = require("./song.model");
const Playlist = require("./playlist.model");

let Pls = null;
// create users table
Pls = sequelize.define("pls", {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    indexIn: {
        type: DataTypes.INTEGER,
    },
});

Pls.belongsTo(Song, {
    foreignKey: "song_id",
    targetKey: "_id",
});

module.exports = Pls;
