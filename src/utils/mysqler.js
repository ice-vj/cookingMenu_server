 //let MySql = require('@mysql/xdevapi');
let MySql = require('mysql');
// let MySql = require('promise-mysql');

/*
 * MySqler class
 */
function MySqler() {
    this.dbs = {};
}

MySqler.prototype.init = async function (dbs_conf) {
    this.dbs_conf = dbs_conf;
    for (let name in dbs_conf) {
        if (!dbs_conf.hasOwnProperty(name)) continue;
        console.log(`init ${name}`);
        let db_cof = dbs_conf[name];
        try {
            // let connection = MySql.getSession(db_cof);
            let connection = await MySql.createConnection(db_cof);
            //connection.connect();
            this.dbs[name] = connection;
        } catch (e) {
            throw new Error(`Init ${name} failed: ${e.message}`);
        }
    };
};

MySqler.prototype.use = function (name) {
    return this.dbs[name];
};

module.exports = new MySqler();
