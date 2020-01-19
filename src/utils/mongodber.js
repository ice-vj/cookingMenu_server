let MongoClient = require('mongodb').MongoClient;

/*
 * Mongodber class
 */
function Mongodber() {
    this.dbs = {};
}

Mongodber.prototype.init = async function (dbs_conf) {
    this.dbs_conf = dbs_conf;
    let promises = Object.keys(dbs_conf).map(name => (async () => {
        console.log(`init ${name}`);
        let db_url = dbs_conf[name];
        try {
            this.dbs[name] = await MongoClient.connect(db_url, 
                {useNewUrlParser: true, useUnifiedTopology: true,  minSize: 10});
        } catch (e) {
            throw new Error(`Init ${name} failed: ${e.message}`);
        }
    })());
    await Promise.all(promises);
    
};

Mongodber.prototype.use = function (name) {
    return this.dbs[name].db(name);
};

module.exports = new Mongodber();
