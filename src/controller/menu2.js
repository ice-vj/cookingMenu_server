
const baseClass = require('../utils/baseClass');
const BaseModel = require('../utils/baseModelSql');
const mysqler = require('../utils/mysqler');
const MySqler = require('../utils/mysqler');
class Menu extends baseClass{
    constructor() {
        super();
        this.DBName = 'cmp_db';
        this.TableName = 'types';
    }

    async initTypes ({request: req, response: res, util}) {
        const initTypes = [
            ['特色'],
            ['肉类'],
            ['蛋炒'],
            ['素菜'],
            ['凉菜'],
            ['汤粥'],
            ['主食'],
        ];
        await MySqler.query(this.DBName, BaseModel.CREATE_TABLE(this.TableName));
        await MySqler.query(this.DBName, BaseModel.INSERT_DATA(this.TableName, 'name'), initTypes)
        return res.wrapper.succ(initTypes);
    }

    async getTypes ({ request: req, response: res }) {
        const types = await MySqler.query(this.DBName, BaseModel.QUERY_DATAS(this.TableName, 'name'));
        let resultData = [];
        if (types) resultData = types.map(e => e.name).filter(e => e);
        return res.wrapper.succ(resultData);
    }

    async getMenu({ request: req, response: res })  {
        let {type, limit = 10, offset = 0} = req.query;
        limit = +limit; offset = +offset;
        let r = await baseModel._getListByCond('menu', {type}, {limit, offset, total:1});
        return res.wrapper.succ(r);
    }

    async addMenu({ request: req, response: res })  {
        let { type, name } = req.body;
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
        await baseModel._removeInstanceByCond('menu', {_id: id});
        await baseModel._updateInstanceByCond('order', {type}, {$pull: {orders: `${_id}`}});
        return res.wrapper.succ({result: true});
    }
}


module.exports = new Menu();