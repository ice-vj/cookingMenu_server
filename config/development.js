/* eslint-disable quotes,no-process-env */
module.exports = {
    "PORT": process.env.NODE_PORT || 8080,

    "MONGODBS": {
        "cmp_db": "mongodb://127.0.0.1:27017/cmp_db"
    },

    "REDIS": {
        "host": "127.0.0.1",
        "port": 6379,
        "db": 0,
        "password": ""
    },

    "MYSQL": {
        "cmp_db": {
            host: 'localhost',       
            user: 'vj',              
            password: '666666',       
            port: '3306',                   
            database: 'cmp_db' 
        }
    }
};
