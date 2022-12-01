let log = require("loglevel");

export default class DBInterface {
    //get from table
    get(location, criterion) {
        log.error("UNIMPLEMENTED: DBInterface.get()");
    }

    //set from table
    set(location, data) {
        log.error("UNIMPLEMENTED: DBInterface.set");
    }
    //delete from table
    delete(location, data) {
        log.error("UNIMPLEMENTED: DBInterface.data");
    }

    //should also return some pointer tot eh newly created data
    createData(location, data) {
        log.error("UNIMPLEMENTED: DBInterface.create");
    }
}
