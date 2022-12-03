const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const User = require("./user.model");
const Playlist = require("./playlist.model");

let Comment = null;
// create users table
Comment = sequelize.define("comments", {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    comment: {
        type: DataTypes.STRING,
    },
});

Comment.belongsTo(Playlist, {
    foreignKey: "playlist_id",
    targetKey: "_id",
});

Comment.belongsTo(User, {
    foreignKey: "username",
    targetKey: "username",
});

module.exports = Comment;
