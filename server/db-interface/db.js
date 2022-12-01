var config = require("../../config.json");
var mysqlinterface = require("./mysql-interface");

const isUsingMySQL = config.usingMySQL;

let dbinterface = null;
if (isUsingMySQL) {
    dbinterface = mysqlinterface;
} else {
    console.log("NO DB AVAILABLE");
}

module.exports = dbinterface;
 