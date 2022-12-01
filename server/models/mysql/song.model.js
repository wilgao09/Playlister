const { DataTypes } = require("sequelize");
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

module.exports = Song;
