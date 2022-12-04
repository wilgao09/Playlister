const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

// const User = require("./user.model");
// const Playlist = require("./playlist.model");

let Like = null;
// create users table
Like = sequelize.define("likes", {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    liked: {
        type: DataTypes.BOOLEAN,
    },
});

// Like.belongsTo(Playlist, {
//     foreignKey: "playlist_id",
//     targetKey: "_id",
// });

// Like.belongsTo(User, {
//     foreignKey: "username",
//     targetKey: "username",
// });

module.exports = Like;
