const Url = require('url');
const axios = require('axios');

class HttpProxy  {
    constructor(config) {
        if (!config) {
            throw new Error('config can not be null');
        }
        this.config = config || {};
        const serviceCache = {};
        this.serviceCache = serviceCache;
        this.target = Url.format({
            protocol: config.protocol,
            port: config.port,
            hostname: config.hostname
        });
    }

    async doRequest(pathname, options) {
        options = options || {};
        // const that = this;
        const doUrl = Url.format({
            host: this.target,
            pathname
        });
        let query =  options.query || {};
        let addQuery = this.config.addQuery || {};
        query = {...query,...addQuery};
        let response = await axios({
            url: doUrl,
            method: options.method || 'GET',
            headers: options.headers || {},
            params: query,
            ...(options.body ? {data: options.body} : {}),
            responseType: options.responseType || {},
            withCredentials: options.credentials || false
        });
        return response;
    }

}

module.exports = HttpProxy;
