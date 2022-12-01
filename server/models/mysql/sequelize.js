const { Sequelize } = require("sequelize");

const log = require("loglevel");

// TODO:
const sequelize = new Sequelize("playlister", "root", "toor", {
    host: "localhost",
    dialect: "mysql",
    logging: (...msg) => log.info(msg),
});

module.exports = sequelize;
