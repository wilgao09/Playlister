const { DataTypes } = require("sequelize");
// const Pls = require("./pls.model");
const sequelize = require("./sequelize");

let Song = null;
// create users table
Song = sequelize.define("songs", {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
    },
    artist: {
        type: DataTypes.STRING,
    },
    youTubeId: {
        type: DataTypes.STRING,
    },
    refs: {
        type: DataTypes.INTEGER,
    },
});

// Song.hasMany(Pls, {
//     foreignKey: "song_id",
//     targetKey: "_id",
//     as: "song",
// });

module.exports = Song;
