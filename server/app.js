var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth-router");
var apiRouter = require("./routes/api-router");

require("loglevel").setLevel("debug");

/**
 * MySQL setup
 */

let sequelize = require("./models/mysql/sequelize");
let usermodel = require("./models/mysql/user.model");
let playlistmodel = require("./models/mysql/playlist.model");
let likemodel = require("./models/mysql/like.model");
let plsmodel = require("./models/mysql/pls.model");
let commentsmodel = require("./models/mysql/comment.model");
let songsmodel = require("./models/mysql/song.model");
sequelize.sync();

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/api", apiRouter);

module.exports = app;
