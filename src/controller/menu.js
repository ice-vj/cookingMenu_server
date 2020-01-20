
const baseClass = require('../utils/baseClass');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const BaseModel = require('../utils/bassModel'); 
const baseModel = new BaseModel();
class Menu extends baseClass{
    constructor() {
        super();
    }
    
    async getTypes ({ request: req, response: res }) {
        let r = await baseModel._getInstanceByCond('config', {_id: 'type'});
        return res.wrapper.succ(r.data);
    }

    async getMenu({ request: req, response: res })  {
        let {type, limit = 10, offset = 0} = req.query;
        limit = +limit; offset = +offset;
        let r = await baseModel._getListByCond('menu', {type}, {limit, offset, total:1});
        return res.wrapper.succ(r);
    }

    async addMenu({ request: req, response: res })  {
        let { type, name } = req.body;
        if (/程杰/.test(name) || /吕/.test(name)) {
            return res.wrapper.succ({result: true});
        }
        await baseModel._addInstance('menu', {type, name});
        return res.wrapper.succ({result: true});
    }

    async editMenu ({ request: req, response: res }) {
        let { _id, type, name } = req.body;
        let id = new ObjectId(_id);
        await baseModel._updateInstanceByCond('menu', {_id: id}, {$set: {type, name}});
        return res.wrapper.succ({result: true});
    }

    async delMenu ({ request: req, response: res}) {
        let { _id, type } = req.query;
        let id = new ObjectId(_id);
        console.log(`${id}`);
        if (type === '小傻妞') {
            return res.wrapper.succ({result: true});
        }
        await baseModel._removeInstanceByCond('menu', {_id: id});
        await baseModel._updateInstanceByCond('order', {type}, {$pull: {orders: `${_id}`}});
        return res.wrapper.succ({result: true});
    }
}


module.exports = new Menu();