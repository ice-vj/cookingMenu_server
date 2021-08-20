
const baseClass = require('../utils/baseClass');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const BaseModel = require('../utils/baseModel'); 
const baseModel = new BaseModel();
class Order extends baseClass{
    constructor() {
        super();
    }
    
    async getOrder({ request: req, response: res })  {
        let { type } = req.query;
        let r = await baseModel._getInstanceByCond('order', {type});
        if (!r) {
            return res.wrapper.succ([]);
        }
        let ids = r.orders ? r.orders.map(e => ObjectId(e)) : [];
        r = await baseModel._getListByCond('menu', {_id: {$in: ids}});
        return res.wrapper.succ(r);
    }

    async addOrder({ request: req, response: res })  {
        let { type, _id } = req.body;
        await baseModel._updateInstanceByCond('order', {type}, {$addToSet: {orders: _id}}, {upsert: true});
        return res.wrapper.succ({result: true});
    }

    async delOrder ({ request: req, response: res}) {
        let { type, _id } = req.query;
        await baseModel._updateInstanceByCond('order', {type}, {$pull: {orders: _id}});
        return res.wrapper.succ({result: true});
    }
}


module.exports = new Order();