const MySql = require('mysql');
const config = require('../../config/development');
/*
 * MySqler class
 */
function MySqler() {
    this.pools = {};
    this.dbs_conf = config.MYSQL
}

MySqler.prototype.query = async function (name, sql, params) {
    for (let name in this.dbs_conf) {
        if (!this.dbs_conf.hasOwnProperty(name) || this.pools[name]) continue;
        console.log(`init ${name}`);
        let db_cof = this.dbs_conf[name];
        try {
            this.pools[name] = await MySql.createPool(db_cof);
        } catch (e) {
            throw new Error(`Init ${name} failed: ${e.message}`);
        }
    };
    return new Promise((resolve, reject) => {
        this.pools[name].getConnection((err, connection) => {//初始化连接池
            if (err) console.log(err,'数据库连接失败');
            else connection.query(sql, [params],(err, results) => {//去数据库查询数据
                connection.release()//释放连接资源
                if (err) reject(err);
                else resolve(results);
            })
        })
    })
};

module.exports = new MySqler();
