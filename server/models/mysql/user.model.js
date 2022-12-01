const { DataTypes } = require("sequelize");
const Playlist = require("./playlist.model");
const sequelize = require("./sequelize");

let User = null;
// create users table
User = sequelize.define("users", {
    _id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    fname: {
        type: DataTypes.STRING,
    },
    lname: {
        type: DataTypes.STRING,
    },

    password_hash: {
        type: DataTypes.STRING,
    },
    username: {
        type: DataTypes.STRING,
    },
});

User.hasMany(Playlist, {
    foreignKey: "owner",
    sourceKey: "_id",
});

module.exports = User;
