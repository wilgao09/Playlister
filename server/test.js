// let db = require("./db-interface/db");

// console.log("what is db");
// console.log(db);

// let database = new db();
// (async function () {
//     database.initializeConnection().then((res) => {
//         console.log("connected");
//         createEntry();
//     });
// })();

// function createEntry() {
//     database.sequelize.sync().then(() =>
//         database.Users().create({
//             fname: "John",
//             lname: "Doe",
//             email: "john.doe@gmail.com",
//         })
//     );
// }

const sequelize = require("./models/mysql/sequelize");
const User = require("./models/mysql/user.model");
const Playlist = require("./models/mysql/playlist.model");
const Pls = require("./models/mysql/pls.model");
const Song = require("./models/mysql/song.model");

// sequelize.authenticate().then(() =>
//     User.create({
//         fname: "A",
//         lname: "B",
//         email: "C",
//     }).then((res) => console.log(res.dataValues))
// );

let nuser, nsong;

sequelize
    .authenticate()
    .then(() => sequelize.sync())
    .then(() =>
        User.create({
            fname: "Jonathan",
            lname: "Jon",
            email: "jonjonjon@gmail.com",
        })
            .then((data) => {
                nuser = data.dataValues;
                return Song.create({
                    title: "Dangerous Jungle",
                    artist: "Laur",
                    youTubeId: "XXRn1h56iXs",
                    refs: 77,
                });
            })
            .then((data) => {
                nsong = data.dataValues;
                return Playlist.create({
                    owner: nuser._id,
                    name: "myplaylist",
                });
            })
            .then((data) => {
                return Pls.create({
                    in: data.dataValues._id,
                    song_id: nsong._id,
                    indexIn: 0,
                });
            })
    );
