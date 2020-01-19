const _ = require('lodash');

const RETURN_CODE = {
    'OK': 0,                   // 处理成功
    'URL_ERROR': 1,            // api错误
    'AUTH_ERROR': 2,           // app_key, app_secret 认证信息错误
    'PARAMETERS_ERROR': 3,     // 上送参数错误
    'HANDLE_ERROR': 4,         // 业务处理错误
    'NULL_ERROR': 5,           // 空数据
    'EXCEED_FRQ_ERROR': 6,     // 访问频率过快
    'ILLEGAL_USER': 7,         // 被封的用户
    'NEED_VIP_ERROR': 8,       // 非会员
};

const RETURN_MSG = {
    'OK': 'OK',                                 // 处理成功
    'URL_ERROR': 'api not found',               // api错误
    'AUTH_ERROR': 'authentication error',   	// app_key, app_secret 认证信息错误
    'PARAMETERS_ERROR': 'parameters error',     // 上送参数错误
    'HANDLE_ERROR': 'server error',          	// 业务处理错误
    'NULL_ERROR': 'cannot query data',          // 查询不到数据
    'EXCEED_FRQ_ERROR': 'api freq out of limit',// 访问频率过快
    'ILLEGAL_USER': 'user is untrusted',        // 被封的用户
    'NEED_VIP_ERROR': 'user must be vip',       // 用户必须为vip才可以访问
};

function ResponseWrapper(res) {
    this.res = res;
    const wrapper = (...args) => {
        this.succ.call(this, ...args);
    };
    Object.getOwnPropertyNames(this.constructor.prototype).forEach(key => {
        if (_.isFunction(this[key])) {
            if (key === 'constructor') return;
            wrapper[key] = this[key].bind(this);
        }
    });
    return wrapper;
}

ResponseWrapper.RETURN_CODE = RETURN_CODE;

ResponseWrapper.prototype.error = function (type, desc, data) {
    this.res.status = 200;
    if (desc instanceof Error) {
        desc = desc.message;
    }
    let msg = desc ? desc : RETURN_MSG[type];
    this.res.body = {
        code: RETURN_CODE[type],
        msg: msg,
        data: (data && data.toString()) || null,
    };
};

ResponseWrapper.prototype.succ = function (data) {
    this.res.status = 200;
    this.res.body = {
        code: RETURN_CODE['OK'],
        msg: RETURN_MSG['OK'],
        data: data,
    };
};

ResponseWrapper.prototype.send = function (data) {
    this.res.status = 200;
    data.data = data.data || null;
    this.res.body = data;
};


module.exports = function () {
    return function (ctx, next) {
        const responseWrapper = new ResponseWrapper(ctx.response);
        ctx.wrapper = ctx.response.wrapper = responseWrapper;
        return next();
    };
};
