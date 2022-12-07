var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth-router");
var apiRouter = require("./routes/api-router");

require("loglevel").setLevel("debug");

let cors = require("cors");

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

// var corsOptions = {
//     origin: "http://localhost:3000",
//     // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    console.log("body");
    console.log(req.body);
    next();
});

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/api", apiRouter);

module.exports = app;
