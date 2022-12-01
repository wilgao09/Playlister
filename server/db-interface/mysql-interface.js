const sequelize = require("../models/mysql/sequelize");
const userModel = require("../models/mysql/user.model");

const log = require("loglevel");

class MySQLInterface {
    constructor() {
        this.sequelize = null;
        this.user = null;
    }
    initializeConnection() {
        return new Promise((resolve, reject) => {
            sequelize
                .validate()
                .then((sqlize) => {
                    this.sequelize = sqlize;
                    return userModel(this.sequelize);
                })
                .then((umodel) => {
                    this.user = umodel;
                    log.trace("Completed mysql init");
                    resolve(true);
                })
                .catch((err) => {
                    log.error(err);
                    reject(err);
                });
        });
    }

    getPlaylists = () => {};

    Users = () => {
        return this.user;
    };

    sequelize = () => this.sequelize;
}

module.exports = MySQLInterface;
